import React, { Fragment, ReactNode, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useDrag } from 'react-use-gesture';
import { TextureLoader } from 'three';

interface IProps {
  children?: ReactNode;
}

const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
};
const IMAGE_SRC =
  'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?cs=srgb&dl=pexels-pavlo-luchkovski-337909.jpg&fm=jpg';

const Draggable = (props: IProps) => {
  const { children } = props;
  const [position, setPosition] = useState([0, 0, 0]);
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const bind = useDrag(
    ({ offset: [x, y] }) => {
      const newX = clamp(x, -20, 20);
      const newY = clamp(y, -100, 100);

      const [, , z] = position;
      setPosition([0, -y / aspect, z]);
    },
    { pointerEvents: true }
  );

  const texture = new TextureLoader().load(IMAGE_SRC);
  return (
    <mesh position={[position[0], position[1], position[2]]} {...bind()}>
      {!children && (
        <Fragment>
          <boxBufferGeometry args={[1, 1, 1]} />
          <meshPhongMaterial color="#eeeeee" shininess={0} />
          <meshStandardMaterial attach="material" map={texture} />
        </Fragment>
      )}
      {children}
    </mesh>
  );
};

export default Draggable;
