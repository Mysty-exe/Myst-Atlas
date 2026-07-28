import { useCubeTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

function Skybox() {
  const { scene } = useThree();

  const texture = useCubeTexture(
    [
            "right.jpg",
            "left.jpg",
            "top.jpg",
            "bottom.jpg",
            "front.jpg",
            "back.jpg"
        ],
        {
            path: "/Skybox/"
        }
  );
  
  useEffect(() => {
        scene.background = texture;

        return () => {
            scene.background = null;
        };
    }, [texture]);


  return null;
}

export default Skybox
