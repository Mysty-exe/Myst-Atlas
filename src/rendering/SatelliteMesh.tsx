import { useContext, useRef, type RefObject } from "react";
import { BackSide, Camera, Color, InstancedMesh, Mesh, Object3D, Ray, Sphere, Vector3 } from "three";
import { earth } from "./EarthMesh";
import { useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { AppContext } from "../App";

export interface Satellite {
    name: string,
    type: string,
    colour: string;
    NORAD: number,
    lat: number,
    lon: number,
    alt: number
}

export const getPosition = (lat: number, lon: number, alt: number) => {
    const start = earth.radius + 25 + (alt / 50);

    return new Vector3(
        start * Math.cos(lat) * Math.cos(-lon),
        start * Math.sin(lat),
        start * Math.cos(lat) * Math.sin(-lon)
    );
}

const satelliteInView = (mesh: RefObject<InstancedMesh | null>, cameraPos: Vector3, sat: Satellite) => {
    if (!mesh.current) {return;}
    
    const satPos = getPosition(sat.lat, sat.lon, sat.alt);
    const worldPos = satPos.clone();
    mesh.current.localToWorld(worldPos);
    
    const direction = worldPos.clone().sub(cameraPos.clone()).normalize();

    const ray = new Ray(cameraPos.clone(), direction);

    const earthSphere = new Sphere(
        new Vector3(0, 0, 0),
        earth.radius
    );

    const hitPoint = ray.intersectSphere(earthSphere, new Vector3());
    if (!hitPoint) return true;

    const earthDistance = cameraPos.distanceTo(hitPoint)
    const satelliteDistance = cameraPos.distanceTo(worldPos)
    if (earthDistance < satelliteDistance) return false
    else return true
}

const goToSatellite = (mesh: RefObject<InstancedMesh | null>, camera: Camera, sat: Satellite, doneMovingCam: RefObject<boolean>) => {
    if (!mesh.current) {return;}

    const satPos = getPosition(sat.lat, sat.lon, sat.alt);

    const worldPos = satPos.clone();
    mesh.current.localToWorld(worldPos);
    const finalPos = worldPos.clone().add(worldPos.normalize().multiplyScalar(1000));
    camera.lookAt(0, 0, 0);
    camera.position.lerp(finalPos, 0.2)

    if (finalPos.distanceTo(camera.position) < 10)
        doneMovingCam.current = true;
}

const followSat = (mesh: RefObject<InstancedMesh| null>, camera: Camera, sat: Satellite) => {
    if (!mesh.current) {return;}
    
    const satPos = getPosition(sat.lat, sat.lon, sat.alt);

    const worldPos = satPos.clone();
    mesh.current.localToWorld(worldPos);
    const finalPos = worldPos.clone().add(worldPos.normalize().multiplyScalar(1000));
    camera.lookAt(0, 0, 0);
    camera.position.lerp(finalPos, 0.2)
}

function SatelliteGroup() {
    const context = useContext(AppContext)

    const { camera } = useThree();
    const hoveredSats = useRef<number[]>([]);
    const clickedSatellites = useRef<number[]>([]);
    const trajectoryDirectionRef = useRef(new Vector3());
    const meshRef = useRef<InstancedMesh>(null);
    const hoverMesh = useRef<Mesh>(null!);
    const dummy = new Object3D();
    const locationTimer = useRef(2);

    useFrame((_, delta) => {
        if (!meshRef.current) return;
        if (!context) return;

        if (context.followSatellite.current && context.selectedSatelliteIndex.current.length == 1)
            followSat(meshRef, camera, context.satellitesRef.current[context.selectedSatelliteIndex.current[0]]);

        if (context.trajectoryRef.current) {
            const loc1: Satellite = context.trajectoryRef.current.at!(-1)!;
            const loc2: Satellite = context.trajectoryRef.current.at!(-2)!;
            trajectoryDirectionRef.current = (getPosition(loc1.lat, loc1.lon, loc1.alt).sub(getPosition(loc2.lat, loc2.lon, loc2.alt))).normalize();
        }

        if (clickedSatellites.current.length > 0) {
            if (clickedSatellites.current[0] != context.selectedSatelliteIndex.current[0]) {
                context.selectedSatelliteIndex.current.length = 0;
                context.setSelectedLocation(null);
                hoveredSats.current.map(i => context.selectedSatelliteIndex.current.push(i));
            }
            else {
                context.setSelectedLocation(null);
                context.selectedSatelliteIndex.current.length = 0;
            }
        }
        clickedSatellites.current.length = 0;

        if (context.selectedSatelliteIndex.current.length == 1  && !context.resetFilterRef.current)
        {
            locationTimer.current += delta;

            if (context.workerRef.current) {
                context.workerRef.current.postMessage({
                    type: "getSatellite",
                    index: context.selectedSatelliteIndex.current[0]
                });

                context.workerRef.current.postMessage({
                    type: "getTrajectory",
                    index: context.selectedSatelliteIndex.current[0]
                });

                if (locationTimer.current > 5 && context.trajectoryRef.current)
                {
                    context.workerRef.current.postMessage({
                        type: "getSatelliteLocation",
                        index: context.selectedSatelliteIndex.current[0],
                        points: [context.satellitesRef.current[context.selectedSatelliteIndex.current[0]],
                                context.trajectoryRef.current.at(150),
                                context.trajectoryRef.current.at(300),
                                context.trajectoryRef.current.at(-1)]
                    });
                    locationTimer.current = 0;
                }
            }
        } else {
            context.trajectoryRef.current = null;
            context.setSelectedSatellite(null);
            context.setSelectedLocation(null);
        }

        if (context.selectedSatelliteIndex.current.length == 1 && !context.doneMovingCam.current) {
            context.setTimeRate(1);
            goToSatellite(meshRef, camera, context.satellitesRef.current[context.selectedSatelliteIndex.current[0]], context.doneMovingCam);
        }

        if (context.resetFilterRef.current) {
            trajectoryDirectionRef.current = new Vector3();
            context.trajectoryRef.current = null;
            context.setSelectedSatellite(null);
            context.selectedSatelliteIndex.current.length = 0;
            context.setSelectedLocation(null);

            context.resetFilterRef.current = false;
        }

        const satellites = context.satellitesRef.current;
        meshRef.current.count = satellites.length;

        let closestDist = Infinity;

        for (const i of hoveredSats.current) {
            const sat = satellites[i];

            const dist = camera.position.distanceTo(
                getPosition(sat.lat, sat.lon, sat.alt)
            );

            if (dist < closestDist) {
                closestDist = dist;
            }
        }

        let hovered: number[] = [];
        hoveredSats.current.map((sat) => {
            const s = satellites[sat];
            if (camera.position.distanceTo(getPosition(s.lat, s.lon, s.alt)) == closestDist)
                hovered.push(sat);
        });
        hoveredSats.current = hovered;

        document.body.style.cursor = "auto";
        satellites.forEach((sat, i) => {
            const pos = getPosition(
                sat.lat,
                sat.lon,
                sat.alt
            );

            dummy.position.copy(pos);
            dummy.updateMatrix();

            meshRef.current!.setMatrixAt(i, dummy.matrix);
            meshRef.current!.setColorAt(i, new Color(sat.colour));

            if (hovered.length == 0 && context.selectedSatelliteIndex.current.length == 0)
                hoverMesh.current.visible = false;
            else
                hoverMesh.current.visible = true;

            if (hovered.includes(i))
                document.body.style.cursor = "pointer";

            if ((hovered.includes(i) && context.selectedSatelliteIndex.current.length == 0) || context.selectedSatelliteIndex.current.includes(i)) {
                hoverMesh.current.position.copy(
                    getPosition(sat.lat, sat.lon, sat.alt)
                );
            }
        });

        meshRef.current.instanceMatrix.needsUpdate = true;

        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }

        meshRef.current.updateMatrixWorld(true);
    });

    if (!context) return;

    return (
        <>
        <instancedMesh ref={meshRef}
        onPointerOver={(e) => {
            if (!context) return;
            if (e.instanceId === undefined) return;
            if (!satelliteInView(meshRef, camera.position, context.satellitesRef.current[e.instanceId])) return
            hoveredSats.current.push(e.instanceId);
        }}
        onPointerOut={(e) => {
            hoveredSats.current = hoveredSats.current.filter(item => item !== e.instanceId);
        }}
        onClick={(e) => {
            if (!context) return;
            if (e.instanceId === undefined) return;
            if (!satelliteInView(meshRef, camera.position, context.satellitesRef.current[e.instanceId])) return
            clickedSatellites.current.push(e.instanceId);
            context.doneMovingCam.current = false;
        }}
        args={[undefined, undefined, 20000]}>
            <sphereGeometry args={[7, 8, 8]} />
            <meshBasicMaterial />
        </instancedMesh>
        <mesh ref={hoverMesh}>
            <sphereGeometry args={[10, 32, 32]} />
            <meshBasicMaterial
                color="white"
                side={BackSide}
            />
        </mesh>
        {context.showOrbit && (context.selectedSatelliteIndex.current.length == 1 && context.selectedSatellite) && <Line
            points={[
                [0, 0, 0],
                getPosition(context.satellitesRef.current[context.selectedSatelliteIndex.current[0]].lat, context.satellitesRef.current[context.selectedSatelliteIndex.current[0]].lon, context.satellitesRef.current[context.selectedSatelliteIndex.current[0]].alt)
            ]}
            color={"white"}
            linewidth={2}
        ></Line>}
        {context.showOrbit && (context.selectedSatelliteIndex.current.length == 1 && context.trajectoryRef.current) && <Line
            points={context.trajectoryRef.current.map(point => getPosition(point.lat, point.lon, point.alt))}
            color={"white"}
            linewidth={2}
        ></Line>}
        {context.showOrbit && (context.selectedSatelliteIndex.current.length == 1 && context.trajectoryRef.current) && <arrowHelper
            args={[
                trajectoryDirectionRef.current,
                getPosition(context.trajectoryRef.current.at(-1)!.lat, context.trajectoryRef.current.at(-1)!.lon, context.trajectoryRef.current.at(-1)!.alt),
                2,
                "white",
                5,
                5
            ]}
        />}
        </>
    );
}

export default SatelliteGroup
