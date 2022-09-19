import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ContactShadows, Environment, OrbitControls, useGLTF, useTexture,
} from '@react-three/drei';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { fabric } from 'fabric';
import * as THREE from 'three';

const IMAGE_SRC = 'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?cs=srgb&dl=pexels-pavlo-luchkovski-337909.jpg&fm=jpg';

function Model(props: any) {
  const group = useRef();
  const { nodes, materials } = useGLTF('/models/thisMayWork.glb');

  const { gl } = useThree();
  const canvas = Array.from(document.getElementsByTagName('canvas'))[1];
  let ctx;
  let texture: any;
  ctx = canvas.getContext('2d');
  texture = new THREE.CanvasTexture(ctx.canvas);
  texture.anisotropy = gl.capabilities.getMaxAnisotropy();
  texture.needsUpdate = true;

  useFrame(() => {
    texture.needsUpdate = true;
  });
  return (
    <group position={[0, -100, 0]} ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_0.geometry}
        material={nodes.mesh_0.material}
      >
        {/* <boxBufferGeometry args={[1, 1, 1]} /> */}
        <meshStandardMaterial attach="material" map={texture}>
          <canvasTexture attach="map" image={canvas} />
        </meshStandardMaterial>
      </mesh>
    </group>
  );
}

useGLTF.preload('/models/thisMayWork.glb');

export default function App() {
  const { editor, onReady } = useFabricJSEditor();

  useEffect(() => {
    if (editor) {
      editor.setFillColor('#FF0000');
      editor.canvas.backgroundColor = 'green';
    }
  });

  const onAddCircle = () => {
    editor?.setFillColor('#FF0000');
    editor?.addText('Hello');
    fabric.Image.fromURL(
      IMAGE_SRC,
      (img) => {
        img.scaleToHeight(100);
        img.scaleToWidth(100);
        editor?.canvas.add(img);
      },
      { crossOrigin: 'anonymous' },
    );
  };

  return (
    <>
      <Canvas
        style={{ height: '60vh' }}
        frameloop="always"
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 200], fov: 450 }}
      >
        <ambientLight intensity={0.7} />
        <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />
        <Suspense fallback={null}>
          <Model />
          <Environment preset="city" />
          <ContactShadows
            rotation-x={Math.PI / 2}
            position={[0, -0.8, 0]}
            opacity={0.25}
            width={10}
            height={10}
            blur={1.5}
            far={0.8}
          />
        </Suspense>
        <OrbitControls />
      </Canvas>
      <div className="test">
        <button type="button" onClick={onAddCircle}>
          Add Circle To Model
        </button>

        <FabricJSCanvas className="sample-canvas" onReady={onReady} />
        <p>move circle around</p>
      </div>
    </>
  );
}

// var json = canvas.toJSON();
// alert(JSON.stringify(json));
// canvas.loadFromJSON(json, function() {
//     canvas.renderAll();
// });
