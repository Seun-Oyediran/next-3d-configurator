import React, { useEffect, useRef } from 'react';

import {
  Engine, Runner, Composite, Bodies, Mouse, Render, MouseConstraint,
} from 'matter-js';

let check = true;

const fallItems = [
  { id: 1, img: 'fall_item_1.JPG', xPos: 100 },
  { id: 2, img: 'fall_item_2.JPG', xPos: 200 },
  { id: 3, img: 'fall_item_3.JPG', xPos: 300 },
  { id: 4, img: 'fall_item_4.JPG', xPos: 400 },
  { id: 5, img: 'fall_item_5.JPG', xPos: 500 },
  { id: 6, img: 'fall_item_6.JPG', xPos: 600 },
];

const MatterComp = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current === null) return;
    if (!check) return;
    check = false;
    // create engine
    const engine = Engine.create();
    const { world } = engine;

    // create renderer
    const AnyRender = Render as any;
    const render = AnyRender.create({
      element: ref.current,
      engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
      },
    });

    Render.run(render);

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    world.bodies = [];

    // const stack = Composites.stack(20, 20, 3, 2, 0, 0, (x: any, y: any) => {
    //   return Bodies.rectangle(x, y, 200, 46, {
    //     density: 0.0005,
    //     frictionAir: 0.06,
    //     restitution: 0.3,
    //     friction: 0.01,
    //     render: {
    //       sprite: {
    //         texture: '/assets/fall_item_2.JPG',
    //         xScale: 0.2,
    //         yScale: 0.2,
    //       },
    //     },
    //   });
    // });
    // Composite.add(world, stack);

    // const stack = Composites.stack(20, 20, 10, 4, 0, 0, (x: any, y: any) => {
    //   return fallItems.forEach(() => {
    //     Bodies.circle(x, y, 46, {
    //       density: 0.0005,
    //       frictionAir: 0.06,
    //       restitution: 0.3,
    //       friction: 0.01,
    //       render: {
    //         sprite: {
    //           texture: '/assets/Amber.png',
    //           xScale: 0.1,
    //           yScale: 0.1,
    //         },
    //       },
    //     });
    //   });
    // });
    // Composite.add(world, stack);

    // Render Items
    fallItems.forEach((item) => {
      const stack = Bodies.rectangle(item.xPos, 100, 200, 46, {
        density: 0.0005,
        frictionAir: 0.06,
        restitution: 0.3,
        friction: 0.01,
        render: {
          sprite: {
            texture: `/assets/${item.img}`,
            xScale: 0.2,
            yScale: 0.2,
          },
        },
      });
      Composite.add(world, stack);
    });

    // Create ground
    const ground = Bodies.rectangle(800 / 2, 600, 800, 10, {
      isStatic: true,
      label: 'floor',
    });
    Composite.add(world, ground);

    // Create left wall
    const leftWall = Bodies.rectangle(0, 600 / 2, 10, 600, {
      isStatic: true,
      label: 'floor',
    });
    Composite.add(world, leftWall);

    // Create right wall
    const rightWall = Bodies.rectangle(800, 600 / 2, 10, 600, {
      isStatic: true,
      label: 'floor',
    });
    Composite.add(world, rightWall);

    // Add mouse control
    // TODO: Disable on mobile
    const mouse = Mouse.create(render.canvas);
    const AnyMouseConstraints = MouseConstraint as any;
    const mouseConstraint = AnyMouseConstraints.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });
    Composite.add(world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;
  }, []);
  return <div ref={ref} />;
};

export default MatterComp;
