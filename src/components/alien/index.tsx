import React from 'react';
import { useSelector } from 'react-redux';
import { Alien, AlienType, selectAlien } from 'states/alien';

import jellyOne from 'images/alien_0-1.png';
import jellyTwo from 'images/alien_0-2.png';
import crabOne from 'images/alien_1-1.png';
import crabTwo from 'images/alien_1-2.png';
import octoOne from 'images/alien_2-1.png';
import octoTwo from 'images/alien_2-2.png';
import alienBoom from 'images/alien_boom.png';

import './style.css';

export function Aliens() {
  const matrix = useSelector(selectAlien.display);
  const types = useSelector(selectAlien.displayType);

  return (
    <div className="alien__container">
      {matrix.map((alien) => {
        if (alien.state < 0) {
          return null;
        }

        return (
          <AlienComponent
            key={alien.id}
            {...alien}
            type={types[alien.type]}
          ></AlienComponent>
        );
      })}
    </div>
  );
}

type AlienProps = Omit<Alien, 'type'> & {
  type: AlienType;
};

export function AlienComponent({ x, y, type, state }: AlienProps) {
  const style: React.CSSProperties = {
    width: `${type.width}px`,
    height: `${type.height}px`,
    transform: `translate(${x}px, ${y}px)`,
  };

  const image = getAlienImage(type, state);
  return (
    <div className="alien" style={style}>
      <img className="alien__image pixel-perfect" alt="alien" src={image}></img>
    </div>
  );
}

function getAlienImage(type: AlienType, state: number) {
  if (type.name === 'jelly') {
    if (state === 1) {
      return jellyOne;
    } else {
      return jellyTwo;
    }
  } else if (type.name === 'crab') {
    if (state === 1) {
      return crabOne;
    } else {
      return crabTwo;
    }
  } else if (type.name === 'octo') {
    if (state === 1) {
      return octoOne;
    } else {
      return octoTwo;
    }
  } else {
    return alienBoom;
  }
}
