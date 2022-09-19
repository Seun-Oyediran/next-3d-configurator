import { useGLTF } from '@react-three/drei';
import React, { useEffect } from 'react';

const AnimatedModel = () => {
  const model: any = useGLTF('/models/animated_character.gltf');

  useEffect(() => {
    console.log(model);

    model.scene.traverse((o: any) => {
      if (o.name) {
        // console.log(o);

        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }, []);

  return (
    <mesh>
      <primitive
        // rotation={rotation}
        // scale={[0.5, 0.5, 0.5]}
        position={[0, -1.2, 0]}
        object={model.scene}
      />
    </mesh>
  );
};

export default AnimatedModel;
