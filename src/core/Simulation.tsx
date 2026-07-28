import Sun from "./Sunlight";
import SatelliteGroup from "../rendering/SatelliteMesh";
import EarthMesh, { earth } from "../rendering/EarthMesh";
import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber"
import { Suspense, useContext, useEffect, useRef } from "react";
import Skybox from "../rendering/Skymap";
import { AppContext } from "../App";

const Scene = () => {
        const context = useContext(AppContext)
        const scene = useRef(null);
        const startRotation = useRef(0);

        useEffect(() => {
            if (scene.current) {
                const date = new Date();
                const utcHours =
                date.getUTCHours() +
                date.getUTCMinutes() / 60 +
                date.getUTCSeconds() / 3600;

                const longitude = (utcHours - 12) * 15;

                startRotation.current = (-180 + longitude) * Math.PI / 180;
            }
        }, []);

        useFrame((_, delta) => {
            context.tSinceRef.current += context.timeRate * delta;

            context.workerRef.current.postMessage({
                type: "setTimeRate",
                tSince: context.tSinceRef.current
            });

            const rotation = startRotation.current + (2 * Math.PI) * (context.tSinceRef.current / (86400 - 240));
            scene.current.rotation.y = ((rotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
        });

    return (
        <>
            <group rotation={[earth.tilt * Math.PI / 180, 0, 0]}>
                <group ref={scene} rotation={[0, 0, 0]}>
                    <EarthMesh />
                    <SatelliteGroup />
                </group>
            </group>
        </>
    )
}

function Simulation() {
    return (
        <>
            <OrbitControls minDistance={earth.radius + 2} maxDistance={5000}/>
            <Sun />
            <ambientLight intensity={0.3} />
            <Suspense fallback={null}>
                <Skybox />
                <Scene />
            </Suspense>
        </>
    )
}

export default Simulation
