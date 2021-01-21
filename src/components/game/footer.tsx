import React from 'react';
import { useSelector } from 'react-redux';
import { selectGame } from 'states/game';

import playerShip from 'images/player.png';

export function Footer() {
  const life = useSelector(selectGame.life);
  const iconCounts = Math.min(7, life - 1);

  return (
    <div className="footer">
      <div className="footer__life">{life}</div>
      <div className="footer__life-icon-container">
        {iconCounts > 0
          ? Array.from({ length: iconCounts }).map((_, i) => (
              <img
                key={i}
                alt="life-icon"
                src={playerShip}
                className="footer__life-icon pixel-perfect"
              ></img>
            ))
          : null}
      </div>
    </div>
  );
}
