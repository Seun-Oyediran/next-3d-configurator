import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { MeshPhongMaterial } from 'three';

function generatePhongMaterial(color: number | string) {
  const INITIAL_MTL = new MeshPhongMaterial({ color, shininess: 10 });
  return INITIAL_MTL;
}

interface IProps {
  color?: string | number;
}

export default function ShirtModel(props: IProps) {
  const { color } = props;
  const model = useGLTF('http://localhost:3000/models/Polo.glb');

  useEffect(() => {
    model.scene.traverse((o: any) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        o.material = generatePhongMaterial(0xf1f1f1);
      }
    });
  }, []);

  useEffect(() => {
    if (color) {
      model.scene.traverse((o: any) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
          o.material = generatePhongMaterial(color);
        }
      });
    }
  }, [color]);

  return <primitive scale={[0.5, 0.5, 0.5]} position={[0, -1, 0]} object={model.scene} />;
}
