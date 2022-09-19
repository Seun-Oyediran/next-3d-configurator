import React, {
  lazy, Suspense, useEffect, useState,
} from 'react';
import { OrbitControls } from '@react-three/drei';
import { Canvas, extend } from '@react-three/fiber';
import { animated } from '@react-spring/three';
import { useSpring } from 'react-spring';
import { fabric } from 'fabric';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { CanvasTexture } from 'three';
import dynamic from 'next/dynamic';
import Draggable from '../components/Draggable';
import { Model } from '../components/New_polo';

const { Text } = require('troika-three-text');

extend({ Text });

const IMAGE_SRC = 'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?cs=srgb&dl=pexels-pavlo-luchkovski-337909.jpg&fm=jpg';

const IMAGE_SRC2 = 'https://scontent.flos5-1.fna.fbcdn.net/v/t31.18172-8/13668798_10153619297185264_4318788820006751987_o.jpg?_nc_cat=105&ccb=1-7&_nc_sid=973b4a&_nc_ohc=gsvGLEZ4M0oAX9r77w2&_nc_ht=scontent.flos5-1.fna&oh=00_AT9kGXwkKiccpIlMMozD6Rmlw9HCqx4wbG92mFggx_RB1A&oe=6338D4A6';

const ModelComponent = dynamic(() => import('../components/ShirtModel'), {
  ssr: false,
});

const Shirt = () => {
  const text = 'Default text';
  const [texter, setTexter] = useState(text);
  const { editor, onReady } = useFabricJSEditor();
  const [position, setPosition] = useState(0);
  const [rotation] = useState([0, 0, 0, 0]);
  const [shirtColor, setShirtColor] = useState('red');
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [change, setChange] = useState<string | undefined>('');
  const [opts] = useState({
    font: 'Philosopher',
    fontSize: 0.1,
    color: 'white',
    maxWidth: 0.6,
    lineHeight: 1,
    letterSpacing: 0,
    textAlign: 'center',
    materialType: 'MeshPhongMaterial',
  });
  const [active, setActive] = useState(false);
  // create a common spring that will be used later to interpolate other values

  const { scale } = useSpring({
    scale: active ? 1.5 : 1,
  });

  const { rotateY } = useSpring({
    rotateY: [0, Math.PI * position, 0],
    reset: true,
  });

  const handleColorChange = () => {
    const num1 = Math.floor(Math.random() * 256);
    const num2 = Math.floor(Math.random() * 256);
    const num3 = Math.floor(Math.random() * 256);
    const newColor = `rgb(${num1}, ${num2}, ${num3})`;
    setShirtColor(newColor);
  };

  useEffect(() => {
    console.log(change);
    console.log(editor?.canvas?.toCanvasElement().getContext('2d'));
  }, [change]);

  const onAddRectangle = () => {
    editor?.setFillColor('#000000');
    fabric.Image.fromURL(
      IMAGE_SRC2,
      (img) => {
        img.scaleToHeight(100);
        img.scaleToWidth(100);
        editor?.canvas.add(img);
      },
      { crossOrigin: 'anonymous' },
    );
    const textd = new fabric.Text('hello', {
      fontSize: 34,
      fill: 'blue',
    });

    editor?.canvas.add(textd);
  };

  useEffect(() => {
    if (editor) {
      // editor.setFillColor('#ffffff');
      editor.canvas.backgroundColor = 'black';
      editor?.canvas.renderAll();

      console.log(editor?.canvas?.toJSON());

      // editor?.canvas?.setDimensions({ height: '600px', width: '200px' });
    }
  }, [editor]);

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
        <Suspense>
          {/* <color attach="background" args={[0xffffff]} /> */}

          {/* <ModelComponent rotation={rotateY} color={shirtColor} scale={scale} /> */}

          <Model />

          <OrbitControls
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
            enableDamping
            enablePan={false}
            dampingFactor={0.1}
            enableRotate={!false}
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

          <Draggable>
            <animated.mesh
              onClick={() => {
                // handleRotate();
                setPosition(position + 0.5);
                setActive(!active);
                // setActive(active ? 0 : 1);
              }}
              position={[0, 0, 0]}
              // rotation={rotateY}
              // rotateY={rotationVal}
              // rotate-y={rotationVal}
              scale={scale}
            >
              <text
                position-z={1}
                rotation={rotation}
                {...opts}
                text={texter as any}
                // font={fonts[opts.font]}
                anchorX="center"
                anchorY="middle"
              >
                {opts.materialType === 'MeshPhongMaterial' ? (
                  <meshPhongMaterial attach="material" shininess={10} color={opts.color} />
                ) : null}
              </text>
            </animated.mesh>
          </Draggable>
          {/* <Draggable /> */}
        </Suspense>
      </Canvas>
      <input
        type="text"
        onChange={(e) => {
          setTexter(e.target.value);
        }}
      />
      <button onClick={handleColorChange} type="button">
        CHange color
      </button>
      <button onClick={onAddRectangle} type="button">
        Rect
      </button>
      <input
        type="file"
        id="file"
        onChange={(e) => {
          if (e.target.files === null) return;
          const file = e.target.files[0];

          const reader = new FileReader();
          reader.onload = (f) => {
            if (f.target === null) return;
            const data = f.target.result as string;
            fabric.Image.fromURL(data, (img) => {
              img.scaleToHeight(100);
              img.scaleToWidth(100);
              editor?.canvas.add(img);
              editor?.canvas.viewportCenterObject(img);
              editor?.canvas.renderAll();
              setChange(editor?.canvas.toJSON());
            });
          };
          reader.readAsDataURL(file);
          editor?.canvas.renderAll();
        }}
      />
      <label htmlFor="file">
        <button onClick={onAddRectangle} type="button">
          Rect
        </button>
      </label>
      <div>
        <FabricJSCanvas className="sample-canvas-ass" onReady={onReady} />
      </div>
    </div>
  );
};

export default Shirt;
