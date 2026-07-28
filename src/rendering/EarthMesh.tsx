import { useGLTF } from "@react-three/drei";
import { Vector3 } from "three";

export const earth = {
    pos: new Vector3(),
    radius: 1000,
    tilt: 23.44
}

const EarthMesh = () => {
    const { scene } = useGLTF('/Models/Earth 2/scene.gltf');
    return <primitive object={scene} scale={new Vector3(earth.radius, earth.radius, earth.radius).divideScalar(100)} />;
}

export default EarthMesh