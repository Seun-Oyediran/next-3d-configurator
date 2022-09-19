import React, { Fragment, useEffect } from 'react';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import {
  BoxBufferGeometry,
  CanvasTexture,
  MeshPhongMaterial,
  MeshStandardMaterial,
  TextureLoader,
} from 'three';
import { animated } from '@react-spring/three';

import { useFrame, useThree } from '@react-three/fiber';
import Draggable from './Draggable';

const IMAGE_SRC = 'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?cs=srgb&dl=pexels-pavlo-luchkovski-337909.jpg&fm=jpg';

function generatePhongMaterial(color: number | string) {
  const INITIAL_MTL = new MeshPhongMaterial({ color, shininess: 10 });
  return INITIAL_MTL;
}

interface IProps {
  color?: string | number;
  rotation?: any;
  scale?: any;
}

export default function ShirtModel(props: IProps) {
  const { color, rotation, scale } = props;
  const { gl } = useThree();

  const [pmndrs] = useTexture([IMAGE_SRC]);
  const model: any = useGLTF('/models/new_polo.glb');
  const model2: any = useGLTF(
    'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/bunny/model.gltf',
  );

  // let canvas;
  // let ctx;
  // let texture;

  useEffect(() => {
    model.scene.traverse((o: any) => {
      if (o.name) {
        // console.log(o);

        o.castShadow = true;
        o.receiveShadow = true;
        const canvas = Array.from(document.getElementsByTagName('canvas'))[1];

        const ctx = canvas.getContext('2d');
        console.log('ctx', ctx);

        const texture = new CanvasTexture(ctx.canvas);
        // texture.anisotropy = gl.capabilities.getMaxAnisotropy();
        texture.needsUpdate = true;
        const material = new MeshStandardMaterial({
          map: texture,
        });
        o.material = material;
        o.material.map.needsUpdate = true;
        console.log(o.material);

        // o.material = generatePhongMaterial(0xf1f1f1);

        // o.rotateX(45);
        // texture.wrapS = RepeatWrapping;
        // texture.wrapT = RepeatWrapping;
        // texture.repeat.set(2, 2);

        // console.log(texture);
      }
    });
    // const geometry = new BoxGeometry(1, 1, 1);
    // const material = new MeshBasicMaterial({ color: 0x000000 });
    // const cube = new Mesh(geometry, material);
    // model.scene.add(cube);
  }, [color]);

  // useEffect(() => {
  //   if (color) {
  //     model.scene.traverse((o: any) => {
  //       if (o.isMesh && o.name) {
  //         o.castShadow = true;
  //         o.receiveShadow = true;
  //         o.material = generatePhongMaterial(color);
  //         // if (o.name !== 'M_Polo_T-shirt_obj008') return;
  //         // const texture = new TextureLoader().load(IMAGE_SRC);
  //         // texture.flipY = false;
  //         // o.material = new MeshPhongMaterial({ shininess: 10, map: texture });
  //       }
  //     });
  //   }
  // }, [color]);

  return (
    <Fragment>
      <animated.mesh scale={scale} rotation={rotation}>
        <primitive
          // rotation={rotation}
          scale={[0.5, 0.5, 0.5]}
          position={[0, -1, 0]}
          object={model.scene}
        />

        {/* <Decal map={pmndrs} /> */}

        {/* <Draggable>
          <mesh>
            <sphereGeometry />
            <meshBasicMaterial />
            <Decal
              debug // Makes "bounding box" of the decal visible
              position={[0, 0, 1.2]} // Position of the decal
              rotation={[0, 0, 0]} // Rotation of the decal (can be a vector or a degree in radians)
              scale={1}
            >
              <meshBasicMaterial map={pmndrs} />
            </Decal>
          </mesh>
        </Draggable> */}
        {/* <meshStandardMaterial map={pmndrs} attach="material" /> */}
      </animated.mesh>
      {/* <Html>
        <FabricJSCanvas className="sample-canvas" onReady={onReady} />
        <button onClick={onAddRectangle} type="button">
          addd
        </button>
      </Html> */}
    </Fragment>
  );
}
