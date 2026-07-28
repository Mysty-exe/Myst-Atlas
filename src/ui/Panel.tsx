import { useContext, useState } from 'react';
import '../styles/Panel.css';
import { AppContext } from '../App';
import { createPortal } from 'react-dom';

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

function getDirection(current, next) {
    const dLat = next.lat - current.lat;
    const dLon = next.lon - current.lon;

    let direction = "";

    if (dLat > 0.001) direction += "N";
    if (dLat < -0.001) direction += "S";

    if (dLon > 0.001) direction += "E";
    if (dLon < -0.001) direction += "W";

    return direction || "Stationary";
}

function getLocationStr(loc) {
    if (loc.city && loc.state)
        return loc.city + " " + loc.state + ", " + loc.country;
    if (loc.city)
        return loc.city + ", " + loc.country;
    if (loc.state)
        return loc.state + ", " + loc.country;
    if (loc.country)
        return loc.country;
    if (loc.ocean)
        return loc.ocean;

    return "Unknown Location";
}

interface TooltipProps {
    text: string;
}

function Tooltip({ text }: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    function showTooltip(e: React.MouseEvent<HTMLSpanElement>) {
        const rect = e.currentTarget.getBoundingClientRect();

        setPosition({
            x: rect.left + rect.width / 2,
            y: rect.top
        });

        setVisible(true);
    }

    return (
        <span
            className="tooltip"
            onMouseEnter={showTooltip}
            onMouseLeave={() => setVisible(false)}
        >
            ⓘ

            {visible &&
                createPortal(
                    <div
                        className="tooltip-text"
                        style={{
                            left: position.x,
                            top: position.y
                        }}
                    >
                        {text}
                    </div>,
                    document.body
                )
            }
        </span>
    );
}

function DetailsPanel() {
    const context = useContext(AppContext);
    const [state, setState] = useState("TLE");

    // if (context.selectedSatelliteIndex.current.length > 1) {
    //     return (
    //         <div className={`satellite-panel open`}>
                
    //         </div>
    //     )
    // }

    const satellite = context.selectedSatellite;

    return (
        <div className={`satellite-panel ${context.selectedSatelliteIndex.current.length > 0 ? "open" : ""}`}>
            {context.selectedSatelliteIndex.current.length > 1 &&
                <div className="satellite-select-panel">

                    <div className="satellite-selection-header">
                        <div>
                            <h2>Multiple Objects Found</h2>

                            <span className="satellite-type">
                                {context.selectedSatelliteIndex.current.length} satellites detected
                            </span>
                        </div>

                        <button className="close-button"
                        onClick={() => {
                            context.selectedSatelliteIndex.current.length = 0;
                        }}>
                            ✕
                        </button>
                    </div>

                    <div className="selection-content">

                        <p className="selection-description">
                            Multiple satellites share this position.
                            Select one to view details.
                        </p>

                        <div className="satellite-options">

                            {context.selectedSatelliteIndex.current.map((sat) => (

                                <button
                                    className="satellite-option"
                                    key={sat.NORAD}
                                    onClick={() => {
                                        context.selectedSatelliteIndex.current = [sat];
                                    }}
                                >

                                    <div className="option-name">
                                        {context.satellitesRef.current[sat].name}
                                    </div>


                                    <div className="option-info">
                                        {context.satellitesRef.current[sat].type} • NORAD {context.satellitesRef.current[sat].NORAD}
                                    </div>

                                </button>

                            ))}

                        </div>

                    </div>

                </div>
            }

            {(context.selectedSatelliteIndex.current.length == 1 && satellite) && 
            (<>
            <div className="satellite-header">
                <div>
                    <h2>{satellite.name}</h2>
                    <span className="satellite-type">{satellite.group} - {satellite.type}</span>
                </div>

                <button className="close-button" onClick={() => context.selectedSatelliteIndex.current.length = 0}>✕</button>
            </div>

            <div className="satellite-status">
                <div className="status-item">
                    <span>TLE Age</span>
                    <b>{satellite.tleAge}</b>
                </div>

                <div className="status-item">
                    <span>Data Accuracy</span>
                    <b style={{ color: satellite.tleAgeColour }}>{satellite.tleAccuracy}</b>
                </div>
            </div>

            <div className="panel-tabs">
                <button className={(state == "TLE") ? "tab active" : "tab"} onClick={() => setState("TLE")}>
                    <b>TLE</b>
                </button>

                <button className={(state == "Tracking") ? "tab active" : "tab"} onClick={() => setState("Tracking")}>
                    <b>Tracking</b>
                </button>
            </div>

            {state == "TLE" && <div className="panel-content">

                <div className="info-section">
                    <h3>Overview</h3>

                    <div className="info-row">
                        <span>
                            NORAD ID
                            <Tooltip text='Unique identification number assigned to the satellite by the US Space Command.' />
                        </span>
                        <span>{satellite.NORAD}</span>
                    </div>

                    <div className="info-row">
                        <span>
                            International Designator
                            <Tooltip text='Launch identifier containing the launch year, launch number, and object designation.' />
                        </span>
                        <span>{satellite.designator}</span>
                    </div>

                    <div className="info-row">
                        <span>
                            Epoch
                            <Tooltip text='The time when this TLE was generated and the satellite position was calculated.' />
                        </span>
                        <span>{satellite.epoch}</span>
                    </div>
                </div>

                {/* <div className="info-section">
                    <h3>Current State</h3>

                    <div className="info-row">
                        <span>Latitude</span>
                        <span>{satellite.tleAccuracy == "Decayed" ? "?" : (satellite.lat * (180 / Math.PI)).toFixed(2)}°</span>
                    </div>

                    <div className="info-row">
                        <span>Longitude</span>
                        <span>{satellite.tleAccuracy == "Decayed" ? "?" : (satellite.lon * (180 / Math.PI)).toFixed(2)}°</span>
                    </div>

                    <div className="info-row">
                        <span>Altitude</span>
                        <span>{satellite.tleAccuracy == "Decayed" ? "?" : satellite.alt.toFixed(2)} km</span>
                    </div>

                    <div className="info-row">
                        <span>Velocity</span>
                        <span>{satellite.tleAccuracy == "Decayed" ? "?" : Math.sqrt(satellite.velX**2 + satellite.velY**2 + satellite.velZ**2).toFixed(2)} km/s</span>
                    </div>
                </div> */}

                <div className="info-section">
                    <h3>Orbital Elements</h3>

                    <div className="info-row">
                        <span>
                            Orbit Number
                            <Tooltip text="Number of completed orbits since launch." />
                        </span>
                        <span>{satellite.orbitNumber}</span>
                    </div>

                    <div className="info-row">
                        <span>
                            Inclination
                            <Tooltip text="Angle between the orbit plane and Earth's equator." />
                        </span>
                        <span>{satellite.inclination.toFixed(2)}°</span>
                    </div>

                    <div className="info-row">
                        <span>
                            Eccentricity
                            <Tooltip text='Measures how stretched the orbit is. 0 represents a circular orbit.' />
                        </span>
                        <span>{satellite.eccentricity}</span>
                    </div>

                    <div className="info-row">
                        <span>
                            RAAN
                            <Tooltip text="Defines where the orbit crosses Earth's equator from south to north." />    
                        </span>
                        <span>{satellite.RAAN.toFixed(2)}°</span>
                    </div>

                    <div className="info-row">
                        <span>
                            Mean Motion
                            <Tooltip text='Number of orbital revolutions completed per day.' />
                        </span>
                        <span>{satellite.meanMotion.toFixed(2)} rev/day</span>
                    </div>

                    <div className="info-row">
                        <span>
                            Mean Anomaly
                            <Tooltip text='Approximate position of the satellite along its orbit.' />
                        </span>
                        <span>{satellite.meanAnomaly}°</span>
                    </div>

                    <div className="info-row">
                        <span>
                            Argument Perigee
                            <Tooltip text='Defines the location of the closest point in the orbit.' />
                        </span>
                        <span>{satellite.argumentPerigee}°</span>
                    </div>
                </div>

                <div className="info-section">
                    <h3>Advanced</h3>

                    <div className="info-row">
                        <span>
                            BSTAR
                            <Tooltip text='Estimates atmospheric drag effects used by SGP4 orbit prediction.' />
                        </span>
                        <span>{satellite.bSTAR}°</span>
                    </div>

                    <div className="info-row">
                        <span>
                            Mean Motion DT²
                            <Tooltip text='Rate of change of mean motion over time.' />
                        </span>
                        <span>−{satellite.meanMotionDT2}</span>
                    </div>

                    <div className="info-row">
                        <span>
                            Mean Motion DDT⁶
                            <Tooltip text='Second-order correction for long-term orbit prediction.' />
                        </span>
                        <span>{satellite.meanMotionDDT6}</span>
                    </div>
                </div>

            </div>}

            {state == "Tracking" &&
                <div className="panel-content">

                    <div className="info-section">
                        <h3>Current Position</h3>

                        <div className="info-row">
                            <span>Over</span>
                            <span>{context.selectedLocation ? <p>{getLocationStr(context.selectedLocation[0])}</p> : "Getting Location... "}</span>
                        </div>

                        <div className="info-row">
                            <span>Latitude</span>
                            <span>{satellite.tleAccuracy == "Decayed" ? "?" : (satellite.lat * (180 / Math.PI)).toFixed(2)}°</span>
                        </div>

                        <div className="info-row">
                            <span>Longitude</span>
                            <span>{satellite.tleAccuracy == "Decayed" ? "?" : (satellite.lon * (180 / Math.PI)).toFixed(2)}°</span>
                        </div>

                        <div className="info-row">
                            <span>Altitude</span>
                            <span>{satellite.tleAccuracy == "Decayed" ? "?" : satellite.alt.toFixed(2)} km</span>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>Motion</h3>

                        <div className="info-row">
                            <span>Velocity</span>
                            <span>{satellite.tleAccuracy == "Decayed" ? "?" : Math.sqrt(satellite.velX**2 + satellite.velY**2 + satellite.velZ**2).toFixed(2)} km/s</span>
                        </div>

                        <div className="info-row">
                            <span>Direction</span>
                            <span>{getDirection(context.trajectoryRef.current[0], context.trajectoryRef.current[1])}</span>
                        </div>

                        <div className="info-row">
                            <span>Orbit Period</span>
                            <span>{(86400 / satellite.meanMotion / 60) > 180 ? (86400 / satellite.meanMotion / 60 / 60).toFixed(2) + " hours" : (86400 / satellite.meanMotion / 60).toFixed(2) + " mins"}</span>
                        </div>

                    </div>

                    <div className="info-section">
                        <h3>Future Path</h3>

                        <div className="pass-card">

                            <div className="pass-time">
                                +{(86400 / satellite.meanMotion / 60) > 180 ? ((86400 / satellite.meanMotion / 60 / 60) / 3).toFixed(2) + " hours" : ((86400 / satellite.meanMotion / 60) / 3).toFixed(2) + " mins"}
                            </div>

                            <div className="pass-location">
                                <span>
                                    {context.selectedLocation ? <p>{getLocationStr(context.selectedLocation[1])}</p> : "Getting Location... "}
                                </span>
                            </div>

                        </div>

                        <div className="pass-card">

                            <div className="pass-time">
                                +{(86400 / satellite.meanMotion / 60) > 180 ? ((86400 / satellite.meanMotion / 60 / 60) / 3 * 2).toFixed(2) + " hours" : ((86400 / satellite.meanMotion / 60) / 3 * 2).toFixed(2) + " mins"}
                            </div>

                            <div className="pass-location">
                                <span>
                                {context.selectedLocation ? <p>{getLocationStr(context.selectedLocation[2])}</p> : "Getting Location... "}
                                </span>
                            </div>

                        </div>

                        <div className="pass-card">

                            <div className="pass-time">
                                +{(86400 / satellite.meanMotion / 60) > 180 ? ((86400 / satellite.meanMotion / 60 / 60)).toFixed(2) + " hours" : ((86400 / satellite.meanMotion / 60)).toFixed(2) + " mins"}
                            </div>

                            <div className="pass-location">
                                <span>
                                    {context.selectedLocation ? <p>{getLocationStr(context.selectedLocation[3])}</p> : "Getting Location... "}
                                </span>
                            </div>

                        </div>

                    </div>

                </div>
            }

            <div className="panel-actions">
                <button
                onClick={() => {
                    context.doneMovingCam.current = false;
                    context.setTimeRate(1);
                }}
                ><b>Focus</b></button>
                <button className={context.followSatellite.current ? "active" : ""}
                onClick={() => {
                    context.followSatellite.current = !context.followSatellite.current;
                }}
                ><b>Follow</b></button>
                <button className={context.showOrbit ? "active" : ""}
                onClick={() => {
                    context.setShowOrbit(!context.showOrbit);
                }}
                ><b>Show Orbit</b></button>
                <button onClick={e => {
                    copyToClipboard(satellite.tleData)
                    e.target.innerHTML = "<b>Copied!</b>";
                    setTimeout(() => {
                        e.target.innerHTML = "<b>Copy TLE</b>";
                    }, 1500);
                    }}
                    ><b>Copy TLE</b></button>
            </div>
            </>
        )}
        </div>
    )
}

export default DetailsPanel