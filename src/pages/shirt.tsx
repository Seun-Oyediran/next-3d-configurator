import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { lazy, Suspense } from 'react';

const ModelComponent = lazy(() => import('../components/ShirtModel'));

const Shirt = () => {
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
      >
        <Suspense>
          <color attach="background" args={[0xffffff]} />
          <ModelComponent color="purple" />
          <OrbitControls
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
            enableDamping
            enablePan={false}
            dampingFactor={0.1}
          />

          <ambientLight intensity={0.25} />
          <directionalLight
            position={[-8, 12, 8]}
            intensity={0.6}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          <directionalLight
            position={[10, 10, 5]}
            intensity={0.6}
            // castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <spotLight intensity={0.3} position={[-8, 1000, 8]} />

          <mesh receiveShadow rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[5000, 5000, 1, 1]} />
            <meshPhongMaterial color="#eeeeee" shininess={0} />
            <shadowMaterial attach="material" opacity={0.4} />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Shirt;
