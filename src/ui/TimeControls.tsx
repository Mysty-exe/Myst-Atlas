import '../styles/TimeControls.css';
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";

interface TimeControlsProps {
  showTime: boolean;
  setShowTime: any;
}

function TimeControls({ showTime, setShowTime }: TimeControlsProps) {
    const context = useContext(AppContext);
    const [quickSpeed, setQuickSpeed] = useState(-1);

    const setQuickSpeedFunc = (num: number) => {
        context.setTimeRate(num);
        setQuickSpeed(num);
    }

    useEffect(() => {
        setQuickSpeed(-1);
        if (context.timeRate == -1000 || context.timeRate == -10 || context.timeRate == 1 || context.timeRate == 10 || context.timeRate == 1000)
            setQuickSpeed(context.timeRate);
    }, [context.timeRate])

    return (
        <div className={`time-popup ${showTime ? "open" : ""} ${context.selectedSatellite ? "move" : ""}`}>

            <div className="time-header">
                <h3>Simulation Time</h3>

                <button className="close-button"
                    onClick={() => {
                        setShowTime(false)
                    }}
                >×</button>
            </div>

            <div className="current-time">
                <div className="date">{context.currentDate.toLocaleDateString()}</div>
                <div className="clock">{context.currentDate.toLocaleTimeString()}</div>
            </div>

            <button className="reset-button"
            onClick={() => {
                const currentTime = new Date();
                context.tSinceRef.current = (currentTime.getTime() - context.startAppDate.current.getTime()) / 1000;
            }}>
                Reset to Current Time
            </button>

            <div className="custom-section">

                <label>Custom Date & Time</label>

                <input type="datetime-local"
                    onChange={e => {
                        const selectedDate = new Date(e.target.value);
                        console.log("DFSDFJK")
                        context.tSinceRef.current = (selectedDate.getTime() - context.startAppDate.current.getTime()) / 1000;
                    }}
                />

            </div>

            <div className="speed-section">

                <label>Time Rate</label>

                <div className="rate-input">
                    <input
                        type="number"
                        min="-1000000"
                        max="1000000"
                        value={context.timeRate}
                        onChange={e => {
                            context.setTimeRate(e.target.value);
                            setQuickSpeed(-1);
                            if (e.target.value == -1000 || e.target.value == -10 || e.target.value == 1 || e.target.value == 10 || e.target.value == 1000)
                                setQuickSpeed(e.target.value);

                            if (e.target.value <= -100 || e.target.value >= 100)
                                context.followSatellite.current = false;
                        }}
                    />

                    <span className="rate-unit">×</span>
                </div>

            </div>

            <div className="speed-section">

                <label>Quick Speed</label>

                <div className="speed-options">

                    <button className={(quickSpeed == -1000) ? "active" : ""}
                        onClick={() => setQuickSpeedFunc(-1000)}
                    >-1000</button>
                    <button className={(quickSpeed == -10) ? "active" : ""}
                        onClick={() => setQuickSpeedFunc(-10)}
                    >-10</button>
                    <button className={(quickSpeed == 1) ? "active" : ""}
                        onClick={() => setQuickSpeedFunc(1)}
                    >1x</button>
                    <button className={(quickSpeed == 10) ? "active" : ""}
                        onClick={() => setQuickSpeedFunc(10)}
                    >10x</button>
                    <button className={(quickSpeed == 1000) ? "active" : ""}
                        onClick={() => setQuickSpeedFunc(1000)}
                    >1000x</button>

                </div>

            </div>
        </div>
    );
}

export default TimeControls;