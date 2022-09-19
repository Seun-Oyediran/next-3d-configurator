import React from 'react';
import { fabric } from 'fabric';

const FabricExample = () => {
  const fabricRef = React.useRef<fabric.Canvas | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const newFabricRef = React.useRef<fabric.Canvas | null>(null);
  const newCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const initFabric = () => {
      fabricRef.current = new fabric.Canvas(canvasRef.current);
      newFabricRef.current = new fabric.Canvas(newCanvasRef.current);
    };

    const addRectangle = () => {
      const rect = new fabric.Rect({
        top: 50,
        left: 50,
        width: 50,
        height: 50,
        fill: 'red',
      });

      const rect2 = new fabric.Rect({
        top: 50,
        left: 50,
        width: 50,
        height: 50,
        fill: 'blue',
      });

      fabricRef?.current?.add(rect);
      newFabricRef.current?.add(rect2);
    };

    const disposeFabric = () => {
      fabricRef?.current?.dispose();
      newFabricRef?.current?.dispose();
    };

    initFabric();
    addRectangle();

    return () => {
      disposeFabric();
    };
  }, []);

  return (
    <div>
      <div>
        <canvas ref={canvasRef} />
      </div>

      <div>
        <canvas ref={newCanvasRef} />
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            const rect = new fabric.Rect({
              top: 50,
              left: 50,
              width: 50,
              height: 50,
              fill: 'red',
            });
            fabricRef.current?.add(rect);
          }}
        >
          click
        </button>
        <button
          type="button"
          onClick={() => {
            console.log(fabricRef.current?.toJSON());
            console.log(newFabricRef.current?.toJSON());
            // console.log(newCanvasRef.current?.getContext('2d'));
          }}
        >
          check
        </button>

        <button
          type="button"
          onClick={() => {
            fabricRef.current?.setBackgroundColor('blue', () => {});
            newFabricRef.current?.setBackgroundColor('red', () => {});
            fabricRef.current?.renderAll();
            newFabricRef.current?.renderAll();
            // console.log(newCanvasRef.current?.getContext('2d'));
          }}
        >
          check
        </button>
      </div>

      {['red', 'black', 'blue'].map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => {
            fabricRef.current?.setBackgroundColor(item, () => {});
            newFabricRef.current?.setBackgroundColor(item, () => {});
            fabricRef.current?.renderAll();
            newFabricRef.current?.renderAll();
          }}
        >
          <div
            style={{
              height: '30px',
              width: '30px',
              background: item,
            }}
          />
        </button>
      ))}
    </div>
  );
};

export default FabricExample;
