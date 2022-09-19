import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';
import { Lights } from '../components/config';
import Draggable from '../components/Draggable';
import { Model } from '../components/Animated_character';

const ModelComponent = dynamic(() => import('../components/AnimatedModel'), {
  ssr: false,
});

const animated = () => {
  return (
    <div className="body">
      <Canvas
        shadows
        id="c"
        className="canvas"
        camera={{
          fov: 50,
          near: 0.1,
          far: 1000,
          position: [0, 0, 5],
        }}
        gl={{
          antialias: true,
        }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          {/* <Draggable>
            <mesh position={[0, 0, 0]}>
              <ModelComponent />
            </mesh>
          </Draggable> */}
          <Model />
        </Suspense>
        <Lights />

        <OrbitControls
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
          enableDamping
          enablePan={false}
          dampingFactor={0.1}
          enableRotate={!false}
        />

        <mesh receiveShadow rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -1.2, 0]}>
          <planeGeometry args={[5000, 5000, 1, 1]} />
          <meshPhongMaterial color="#eeeeee" shininess={0} />
          <shadowMaterial attach="material" opacity={0.4} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default animated;
