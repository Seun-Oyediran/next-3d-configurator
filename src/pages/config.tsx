import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { fabric } from 'fabric';
import { Lights } from '../components/config';
import { Model } from '../components/New_polo';

const colorOptions = ['#f4f4f4', 'red', 'blue', 'black'];

const Config = () => {
  const frontFabricRef = useRef<fabric.Canvas | null>(null);
  const frontCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const backFabricRef = useRef<fabric.Canvas | null>(null);
  const backCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const leftFabricRef = useRef<fabric.Canvas | null>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const rightFabricRef = useRef<fabric.Canvas | null>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [color, setColor] = useState(colorOptions[0]);
  const [activePart, setActivePart] = useState<'front' | 'back' | 'left' | 'right'>('front');

  const canvasOptions = [
    { id: 1, type: 'front', ref: frontCanvasRef },
    { id: 2, type: 'back', ref: backCanvasRef },
    { id: 3, type: 'left', ref: leftCanvasRef },
    { id: 4, type: 'right', ref: rightCanvasRef },
  ];

  const handleChange = () => {};

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (f) => {
      if (f.target === null) return;
      const data = f.target.result as string;

      fabric.Image.fromURL(data, (img) => {
        img.scaleToHeight(100);
        img.scaleToWidth(100);
        let current;
        switch (activePart) {
          case 'front':
            current = frontFabricRef;
            break;
          case 'back':
            current = backFabricRef;
            break;
          case 'left':
            current = leftFabricRef;
            break;
          case 'right':
            current = rightFabricRef;
            break;
          default:
        }
        current?.current?.add(img);
        current?.current?.viewportCenterObject(img);
        current?.current?.renderAll();
        e.target.value = '';
      });
    };
    reader.readAsDataURL(file);
    // editor?.canvas.renderAll();
  };

  useEffect(() => {
    const initFabric = () => {
      // init the fabric canvas
      frontFabricRef.current = new fabric.Canvas(frontCanvasRef.current);
      backFabricRef.current = new fabric.Canvas(backCanvasRef.current);
      leftFabricRef.current = new fabric.Canvas(leftCanvasRef.current);
      rightFabricRef.current = new fabric.Canvas(rightCanvasRef.current);

      //   set canvas dimensions
      frontFabricRef.current?.setDimensions({ width: 200, height: 400 });
      backFabricRef.current?.setDimensions({ width: 200, height: 400 });
      leftFabricRef.current?.setDimensions({ width: 200, height: 400 });
      rightFabricRef.current?.setDimensions({ width: 200, height: 400 });

      //   set fabric bg
      frontFabricRef.current?.setBackgroundColor(color, () => {});
      backFabricRef.current?.setBackgroundColor(color, () => {});
      leftFabricRef.current?.setBackgroundColor(color, () => {});
      rightFabricRef.current?.setBackgroundColor(color, () => {});
    };

    // const addRectangle = () => {
    //   const rect = new fabric.Rect({
    //     top: 50,
    //     left: 50,
    //     width: 50,
    //     height: 50,
    //     fill: 'red',
    //   });

    //   const rect2 = new fabric.Rect({
    //     top: 50,
    //     left: 50,
    //     width: 50,
    //     height: 50,
    //     fill: 'blue',
    //   });

    //   fabricRef?.current?.add(rect);
    //   newFabricRef.current?.add(rect2);
    // };

    const disposeFabric = () => {
      frontFabricRef?.current?.dispose();
      backFabricRef?.current?.dispose();
      leftFabricRef?.current?.dispose();
      rightFabricRef?.current?.dispose();
    };

    initFabric();

    return () => {
      disposeFabric();
    };
  }, []);

  return (
    <div className="config-container-con">
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
        <mesh position={[0, -1.5, 0]}>
          <Model />
        </mesh>
        <Lights />

        <OrbitControls
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
          enableDamping
          enablePan={false}
          dampingFactor={0.1}
          enableRotate={!false}
        />

        <mesh receiveShadow rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[5000, 5000, 1, 1]} />
          <meshPhongMaterial color="#eeeeee" shininess={0} />
          <shadowMaterial attach="material" opacity={0.4} />
        </mesh>
      </Canvas>

      {canvasOptions.map((item) => (
        <div className={`canvas-con ${item.type === activePart ? 'active' : ''} `} key={item.id}>
          <canvas ref={item.ref} className={`canvas-${item.type}`} />
        </div>
      ))}

      <div className="colors-con controls">
        {colorOptions.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setColor(item);
              frontFabricRef.current?.setBackgroundColor(item, () => {});
              backFabricRef.current?.setBackgroundColor(item, () => {});
              leftFabricRef.current?.setBackgroundColor(item, () => {});
              rightFabricRef.current?.setBackgroundColor(item, () => {});

              frontFabricRef.current?.renderAll();
              backFabricRef.current?.renderAll();
              leftFabricRef.current?.renderAll();
              rightFabricRef.current?.renderAll();
            }}
          >
            <div style={{ backgroundColor: item }} />
          </button>
        ))}

        <input type="file" id="canvas-input" onChange={handleImageUpload} />
        <label htmlFor="canvas-input">Image</label>
        <button type="button" onClick={handleChange}>
          cl
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => {
            setActivePart('front');
          }}
        >
          Front
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => {
            setActivePart('back');
          }}
        >
          Back
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => {
            setActivePart('left');
          }}
        >
          Left
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => {
            setActivePart('right');
          }}
        >
          Right
        </button>

        <button
          type="button"
          onClick={() => {
            const front = frontFabricRef.current?.toJSON();
            const back = backFabricRef.current?.toJSON();
            const left = leftFabricRef.current?.toJSON();
            const right = rightFabricRef.current?.toJSON();

            console.log({
              front,
              back,
              left,
              right,
            });
          }}
        >
          Save
        </button>
        <button
          onClick={() => {
            console.log('adding');
          }}
          type="button"
        >
          Add text
        </button>
        <p>{activePart}</p>
      </div>
      {/* <p>hello from config</p> */}
    </div>
  );
};

export default Config;
