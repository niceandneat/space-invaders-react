import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectBlock, Block } from 'states/block';

import './style.css';

export function Blocks() {
  const blocksDisplay: Block[] = useSelector(selectBlock.display);

  return (
    <div className="blocks__container">
      {blocksDisplay.map((props: Block) => (
        <BlockComponent key={props.x} {...props}></BlockComponent>
      ))}
    </div>
  );
}

function BlockComponent({ x, y, width, height, pixels }: Block) {
  const style: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    transform: `translate(${x}px, ${y}px)`,
  };

  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const canvas = ref.current;
    const ctx = canvas.getContext('2d');

    if (ctx == null) {
      return;
    }

    canvas.width = pixels[0].length;
    canvas.height = pixels.length;
    ctx.fillStyle = '#0bff01';

    for (let i = 0; i < pixels.length; i++) {
      const row = pixels[i];
      for (let j = 0; j < row.length; j++) {
        const pixel = row[j];
        if (!pixel) {
          continue;
        }

        ctx.fillRect(j, i, 1, 1);
      }
    }
  }, [ref, pixels]);

  return <canvas className="block__container" style={style} ref={ref}></canvas>;
}

// function BlockComponent({ x, y, width, height, pixels }: Block) {
//   const style: React.CSSProperties = {
//     width: `${width}px`,
//     height: `${height}px`,
//     transform: `translate(${x}px, ${y}px)`,
//   };

//   const pixelWidth = width / pixels[0].length;
//   const pixelHeight = height / pixels.length;

//   function pixelsToDivs(pixels: number[][]) {
//     const divs = [];

//     for (let i = 0; i < pixels.length; i++) {
//       const row = pixels[i];
//       for (let j = 0; j < row.length; j++) {
//         const pixel = row[j];
//         if (!pixel) {
//           continue;
//         }

//         const pixelStyle: React.CSSProperties = {
//           top: i * pixelHeight,
//           left: j * pixelWidth,
//           width: pixelWidth,
//           height: pixelHeight,
//         };

//         const pixelElement = (
//           <div
//             key={`(${i},${j})`}
//             className="block__pixel"
//             style={pixelStyle}
//           ></div>
//         );
//         divs.push(pixelElement);
//       }
//     }

//     return divs;
//   }

//   return (
//     <div className="block__container" style={style}>
//       {pixelsToDivs(pixels)}
//     </div>
//   );
// }
