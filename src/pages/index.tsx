import React, { useLayoutEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  BufferGeometry, Material, Mesh, MeshPhongMaterial,
} from 'three';

const BACKGROUND_COLOR = 0xf1f1f1;

const colors = [
  {
    color: '66533C',
  },
  {
    color: '173A2F',
  },
  {
    color: '153944',
  },
  {
    color: '27548D',
  },
  {
    color: '438AAC',
  },
];

const partsOptions = [
  { id: 1, option: 'legs' },
  { id: 2, option: 'cushions' },
  { id: 3, option: 'base' },
  { id: 4, option: 'supports' },
  { id: 5, option: 'back' },
];

const INITIAL_MTL = new MeshPhongMaterial({ color: BACKGROUND_COLOR, shininess: 10 });
const INITIAL_MAP = [
  { childID: 'back', mtl: INITIAL_MTL },
  { childID: 'base', mtl: INITIAL_MTL },
  { childID: 'cushions', mtl: INITIAL_MTL },
  { childID: 'legs', mtl: INITIAL_MTL },
  { childID: 'supports', mtl: INITIAL_MTL },
];

function initColor(parent: any, type: string, mtl: MeshPhongMaterial) {
  parent.traverse((o: any) => {
    if (o.isMesh) {
      if (o.name.includes(type)) {
        o.material = mtl;
        o.nameID = type; // Set a new property to identify this object
      }
    }
  });
}

const BoxShape = () => {
  const meshRef = useRef<Mesh<BufferGeometry, Material | Material[]>>(null);

  useFrame(() => {
    // console.log(state);

    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 3, 0]}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color="red" />
    </mesh>
  );
};

const modelPath = 'http://localhost:3000/models/chair.glb';

// const modelPath = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/chair.glb';

const Home: NextPage = () => {
  const [activePart, setActivePart] = useState(partsOptions[0].option);
  const [loading, setLoading] = useState(true);

  const gltf = useGLTF(modelPath, true, undefined, () => {
    setLoading(false);
  });

  useLayoutEffect(() => {
    gltf.scene.traverse((o: any) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    for (let i = 0; i < INITIAL_MAP.length; i += 1) {
      initColor(gltf.scene, INITIAL_MAP[i].childID, INITIAL_MAP[i].mtl);
    }
    setLoading(false);
  }, [gltf.scene]);

  const handleColorChange = (color: string) => {
    const newMtl = new MeshPhongMaterial({
      // eslint-disable-next-line
      color: parseInt(`0x${color}`),
      shininess: 10,
    });
    gltf.scene.traverse((o: any) => {
      if (o.isMesh && o.nameID != null) {
        if (o.nameID === activePart) {
          o.material = newMtl;
        }
      }
    });
  };

  return (
    <div className="body">
      {!loading && (
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
          <color attach="background" args={[0xffffff]} />
          <fog attach="fog" args={[BACKGROUND_COLOR, 20, 100]} />
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

          <primitive
            position={[0, -1, 0]}
            rotate={[0, Math.PI, 0]}
            scale={[2, 2, 2]}
            object={gltf.scene}
          />
          <BoxShape />

          <mesh receiveShadow rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[5000, 5000, 1, 1]} />
            <meshPhongMaterial color="#eeeeee" shininess={0} />
            <shadowMaterial attach="material" opacity={0.4} />
          </mesh>
        </Canvas>
      )}

      <div className="controls">
        <div id="js-tray" className="tray">
          <div id="js-tray-slide" className="tray__slide">
            {colors.map((item) => (
              // eslint-disable-next-line
              <div
                key={item.color}
                data-key={item.color}
                style={{ background: `#${item.color}` }}
                className="tray__swatch"
                onClick={() => {
                  handleColorChange(item.color);
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="options">
        {partsOptions.map((item) => (
          // eslint-disable-next-line
          <div
            onClick={() => {
              setActivePart(item.option);
            }}
            className={activePart === item.option ? 'option --is-active' : 'option'}
            key={item.id}
          >
            <img
              src={`https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/${item.option}.svg`}
              alt=""
            />
          </div>
        ))}
      </div>
      {loading && (
        <div className="loading" id="js-loader">
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

export default Home;
