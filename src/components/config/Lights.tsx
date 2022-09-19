import React from 'react';

const Lights = () => {
  return (
    <mesh>
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
    </mesh>
  );
};

export default Lights;
