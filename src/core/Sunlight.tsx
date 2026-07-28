import { useFrame } from "@react-three/fiber";
import { useContext, useRef } from "react";
import { AppContext } from "../App";


function Sun() {
    const context = useContext(AppContext)
    const sunRef = useRef(null);

    useFrame(() => {
        const YEAR_SECONDS = 365.2422 * 24 * 60 * 60;

        const angle =
            ((2 * Math.PI * context.tSinceRef.current) / YEAR_SECONDS) %
            (2 * Math.PI);

        sunRef.current.position.set(
            -Math.cos(angle),
            0,
            Math.sin(angle)
        );
    });

    return (
        <directionalLight ref={sunRef} intensity={2} />
    )
}

export default Sun
