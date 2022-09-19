import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ContactShadows, Environment, OrbitControls, useGLTF, useTexture,
} from '@react-three/drei';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { fabric } from 'fabric';
import * as THREE from 'three';

const IMAGE_SRC = 'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?cs=srgb&dl=pexels-pavlo-luchkovski-337909.jpg&fm=jpg';

const IMAGE_SRC2 = 'https://prod-wombo-paint.s3.amazonaws.com/exports/c01c326e-a527-441b-b39b-ac696b243b2f/blank_tradingcard.jpg?AWSAccessKeyId=AKIAWGXQXQ6WCOB7PP5J&Signature=w5J4WZItkZUEn%2FwBto6lpPg89Vw%3D&Expires=1669958184';

function Model(props: any) {
  const group = useRef();
  const model: any = useGLTF('/models/new_polo.glb');
  const { nodes, materials } = model;

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
    <group {...props} dispose={null} ref={group} position={[0, -100, 0]}>
      <group name="M_Polo_T-shirt_obj" position={[0, 1.67, 0]}>
        <mesh
          name="M_Polo_T-shirt_obj_1"
          geometry={nodes['M_Polo_T-shirt_obj_1'].geometry}
          material={materials.Main}
        />
        <mesh
          name="M_Polo_T-shirt_obj_2"
          geometry={nodes['M_Polo_T-shirt_obj_2'].geometry}
          material={materials.Collar}
        />
      </group>
      <mesh
        name="M_Polo_T-shirt_obj001"
        geometry={nodes['M_Polo_T-shirt_obj001'].geometry}
        material={materials.Button}
        position={[0, 1.67, 0]}
      />
      <mesh
        name="M_Polo_T-shirt_obj002"
        geometry={nodes['M_Polo_T-shirt_obj002'].geometry}
        material={materials.Button}
        position={[0, 1.67, 0]}
      />
      <mesh
        name="M_Polo_T-shirt_obj007"
        geometry={nodes['M_Polo_T-shirt_obj007'].geometry}
        material={materials.Button}
        position={[0, 1.67, 0]}
      />
      <mesh
        name="M_Polo_T-shirt_obj008"
        geometry={nodes['M_Polo_T-shirt_obj008'].geometry}
        material={materials['Front Vinyl']}
        position={[0, 1.67, 0]}
      >
        <meshStandardMaterial attach="material" map={texture}>
          <canvasTexture attach="map" image={canvas} />
        </meshStandardMaterial>
      </mesh>
      <mesh
        name="M_Polo_T-shirt_obj009"
        geometry={nodes['M_Polo_T-shirt_obj009'].geometry}
        material={materials['Back Vinyl']}
        position={[0, 1.67, 0]}
      />
      <mesh
        name="M_Polo_T-shirt_obj010"
        geometry={nodes['M_Polo_T-shirt_obj010'].geometry}
        material={materials['Right Arm Vinyl']}
        position={[-0.92, 2.02, -0.19]}
      />

      <mesh
        name="M_Polo_T-shirt_obj011"
        geometry={nodes['M_Polo_T-shirt_obj011'].geometry}
        material={materials['Left Arm Vinyl ']}
        position={[0, 1.67, 0]}
      />
    </group>
  );
}

useGLTF.preload('/models/new_polo.glb');

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
      IMAGE_SRC2,
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
