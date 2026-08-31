import './styles/App.css';
import Simulation from './core/Simulation.js';
import { createContext, useEffect, useRef, useState, type Dispatch, type RefObject, type SetStateAction } from 'react';
import LoadingScreen from './core/LoadingScreen.js';
import { Canvas, useThree } from '@react-three/fiber';
import UI from './ui/UIOverlay.js';
import type { Satellite } from './rendering/SatelliteMesh.js';
import type { Location } from './database/loadData.js';

interface AppContextType {
    startAppDate: RefObject<Date>;
    currentDate: Date;

    satellitesRef: RefObject<Satellite[]>;
    workerRef: RefObject<Worker | null>;
    tSinceRef: RefObject<number>;

    timeRate: number;
    setTimeRate: Dispatch<SetStateAction<number>>;

    filterRef: RefObject<Map<string, any[][]>>;

    selectedSatellite: Satellite | null;
    setSelectedSatellite: Dispatch<SetStateAction<Satellite | null>>;

    selectedLocation: Location[] | null;
    setSelectedLocation: Dispatch<SetStateAction<Location[] | null>>;

    selectedSatelliteIndex: RefObject<number[]>;

    trajectoryRef: RefObject<Satellite[] | null>;

    resetFilterRef: RefObject<boolean>;

    doneMovingCam: RefObject<boolean>;

    followSatellite: RefObject<boolean>;

    showOrbit: boolean;
    setShowOrbit: Dispatch<SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType | null>(null);

function App() {
  const startAppDate = useRef(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loaded, setLoaded] = useState(false);
  const satellitesRef = useRef<Satellite[]>([]);
  const workerRef = useRef<Worker | null>(null);
  const tSinceRef = useRef(1);
  const [timeRate, setTimeRate] = useState(1);
  const filterRef = useRef(new Map());
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location[] | null>(null);
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

        console.log(window.innerWidth, window.innerHeight);

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
