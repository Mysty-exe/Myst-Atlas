import '../styles/Topbar.css';
import { useContext, useState } from "react";
import TimeControls from "./TimeControls";
import { AppContext } from "../App";
import type { Satellite } from '../rendering/SatelliteMesh';

function Topbar() {
  const context = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [filteredSatellites, setFilteredSatellites] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const MAX_RESULTS = 15;

  return (
    <div className="topbar">
        <div className="topbar-left">
            <h2 className="logo">
                Myst Atlas
            </h2>

            <div className='search-container'>

                <input
                    className="search"
                    type="text"
                    placeholder="Search Satellites - (Name or NORAD ID)"
                    value={search}
                    onFocus={() => {
                        setShowResults(true)
                    }}
                    onBlur={() => {
                        setShowResults(false)
                    }}
                    onChange={e => {
                        setSearch(e.target.value)

                        let filter: any[] = [];
                        if (!context) return;
                        context.satellitesRef.current.map((sat: Satellite, i) => {
                            if (sat.name.toLowerCase().includes(e.target.value.toLowerCase()) || sat.NORAD.toString().includes(e.target.value)) {
                                filter.push([sat, i]);
                            }
                        })

                        setFilteredSatellites(filter);
                    }}
                />

                {showResults && <div className="search-results">

                    <div className="results-header">
                        {filteredSatellites.length} results found
                    </div>


                    <div className="results-list">

                        {filteredSatellites.slice(0, MAX_RESULTS).map((sat: any[], i: number) => (
                            <div
                                className="search-result"
                                key={i}
                                onMouseDown={() => {
                                    setSearch("");
                                    if (!context) return;
                                    context.selectedSatelliteIndex.current = [sat[1]];
                                    context.doneMovingCam.current = false;
                                    context.setTimeRate(1);
                                }}
                            >

                                <div className="result-name">
                                    {sat[0].name}
                                </div>

                                <div className="result-info" style={{ color: sat[0].colour }}>
                                    {sat[0].type} • NORAD {sat[0].NORAD}
                                </div>

                            </div>
                        ))}

                    </div>

                    {filteredSatellites.length > MAX_RESULTS &&
                        <div className="results-footer">
                            Showing {MAX_RESULTS} of {filteredSatellites.length} results
                        </div>
                    }

                </div>}

            </div>

        </div>

        <div className="topbar-right">
            <div className="time" onClick={() => {
              setShowTime(!showTime);
          }}>
                {(context) ? context.currentDate.toLocaleString() : "Loading Date..."}
            </div>

          <TimeControls showTime={showTime} setShowTime={setShowTime} />
        </div>
    </div>
  );
}

export default Topbar
