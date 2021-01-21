import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectBonus } from 'states/bonus';

import bonusShip from 'images/ship.png';
import bonusBoom from 'images/ship_boom.png';

import './style.css';

export function Bonus() {
  const bonusDisplay = useSelector(
    selectBonus.display,
    selectBonus.displayEquals,
  );
  const [state, setState] = useState(0); // 0: hide, 1: ship, 2: boom, 3: score

  const { dx, hit } = bonusDisplay;
  let image = bonusShip;
  let style: React.CSSProperties;

  if (state) {
    style = {
      width: `${bonusDisplay.width}px`,
      height: `${bonusDisplay.height}px`,
      transform: `translate(${bonusDisplay.x}px, ${bonusDisplay.y}px)`,
    };

    if (state === 2) {
      image = bonusBoom;
    }
  } else {
    style = {
      display: 'none',
    };
  }

  useEffect(() => {
    let handle: number;

    if (!dx) {
      if (hit) {
        if (state === 1) {
          setState(2);
        } else if (state === 2) {
          handle = window.setTimeout(() => {
            setState(3);
          }, 500);
        } else if (state === 3) {
          handle = window.setTimeout(() => {
            setState(0);
          }, 500);
        }
      } else {
        if (state !== 0) {
          setState(0);
        }
      }
    } else {
      setState(1);
    }

    return () => {
      if (typeof handle !== 'undefined') {
        window.clearTimeout(handle);
      }
    };
  }, [state, dx, hit]);

  return (
    <div className="bonus__container" style={style}>
      {state === 3 ? (
        <div className="bonus__score">{bonusDisplay.score}</div>
      ) : (
        <img className="bonus__image pixel-perfect" src={image}></img>
      )}
    </div>
  );
}
