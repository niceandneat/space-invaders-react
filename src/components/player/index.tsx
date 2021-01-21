import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectPlayer } from 'states/player';

import playerShip from 'images/player.png';
import playerBoom1 from 'images/player_boom.png';
import playerBoom2 from 'images/player_boom_2.png';

import './style.css';

export function Player() {
  const playerDisplay = useSelector(
    selectPlayer.display,
    selectPlayer.displayEquals,
  );

  const { hit } = playerDisplay;

  const [state, setState] = useState(0); // 0: normal, 1: boom1, 2: boom2

  useEffect(() => {
    let handle: number;

    if (hit) {
      if (state == 1) {
        handle = window.setTimeout(() => setState(2), 100);
      } else if (state == 2) {
        handle = window.setTimeout(() => setState(1), 100);
      } else {
        setState(1);
        return;
      }
    } else {
      if (state !== 0) {
        setState(0);
      }
    }

    return () => window.clearTimeout(handle);
  }, [state, hit]);

  const style: React.CSSProperties = {
    width: `${playerDisplay.width}px`,
    height: `${playerDisplay.height}px`,
    transform: `translate(${playerDisplay.x}px, ${playerDisplay.y}px)`,
  };

  return (
    <div className="player__container" style={style}>
      <img className="player__image pixel-perfect" src={getImage(state)}></img>
    </div>
  );
}

function getImage(state: number) {
  switch (state) {
    case 1:
      return playerBoom1;
    case 2:
      return playerBoom2;
    default:
      return playerShip;
  }
}
