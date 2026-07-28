import './styles/App.css';
import Simulation from './core/Simulation.js';
import React, { useEffect, useRef, useState } from 'react';
import LoadingScreen from './core/LoadingScreen.js';
import { Canvas } from '@react-three/fiber';
import UI from './ui/UIOverlay.js';

type Satellite = {
    name: string;
    colour: string;
    lat: number;
    lon: number;
    alt: number;
};

export const AppContext = React.createContext()

function App() {
  const startAppDate = useRef(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loaded, setLoaded] = useState(false);
  const satellitesRef = useRef<Satellite[]>([]);
  const workerRef = useRef(null);
  const tSinceRef = useRef(1);
  const [timeRate, setTimeRate] = useState(1);
  const filterRef = useRef(new Map());
  const [selectedSatellite, setSelectedSatellite] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const selectedSatelliteIndex = useRef([]);
  const trajectoryRef = useRef(null);
  const resetFilterRef = useRef(false);
  const doneMovingCam = useRef(false);
  const followSatellite = useRef(false);
  const [showOrbit, setShowOrbit] = useState(true);

  useEffect(() => {
        const worker = new Worker(
            new URL("./database/loadData.ts", import.meta.url),
            { type: "module" }
        );

        workerRef.current = worker;

        worker.onmessage = (event) => {
            if (event.data.type == "update")
            {
                satellitesRef.current = event.data.data;
                setLoaded(true);
            }
            if (event.data.type == "getSatellite")
            {
                const sat = event.data.satellite;
                setSelectedSatellite(sat);
            }
            if (event.data.type == "getSatelliteLocation")
            {
                const index = event.data.index;
                const location = event.data.location;
                if (index == selectedSatelliteIndex.current[0])
                    setSelectedLocation(location);
            }
            if (event.data.type == "getTrajectory")
            {
                trajectoryRef.current = event.data.trajectory;
            }
            if (event.data.type == "filter")
            {
                filterRef.current = event.data.data;
            }
        };

        worker.postMessage({
            type: "start",
            tSince: tSinceRef.current
        });

        return () => {
            worker.postMessage({
                type: "stop"
            });

            worker.terminate();
        };
    }, []);

    useEffect(() => {
    const interval = setInterval(() => {
        setCurrentDate(new Date(startAppDate.current.getTime() + (tSinceRef.current * 1000)));
        }, 20);

        return () => clearInterval(interval);
    }, []);

  if (!loaded) {
    return (
        <LoadingScreen />
    );
  }

  return (
    <AppContext.Provider value={{ startAppDate, currentDate, satellitesRef, selectedSatellite, setSelectedSatellite, selectedSatelliteIndex, trajectoryRef, workerRef, tSinceRef, timeRate, setTimeRate, filterRef, resetFilterRef, doneMovingCam, followSatellite, showOrbit, setShowOrbit, selectedLocation, setSelectedLocation}}>
        <div className="app">
            <Canvas camera={{ fov: 50, position: [0, 0, 2500], far: 11000 }}>
                <Simulation />
            </Canvas>
            <UI  />
        </div>
    </AppContext.Provider>
  );
}

export default App
