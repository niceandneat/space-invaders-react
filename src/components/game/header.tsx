import React from 'react';
import { useSelector } from 'react-redux';
import { selectGame } from 'states/game';

export function Header() {
  const score = useSelector(selectGame.score);
  const highScore = useSelector(selectGame.highScore);

  return (
    <div className="header">
      <div className="header__container">
        <div className="header__title">SCORE</div>
        <div className="header__score">{score}</div>
      </div>

      <div className="header__container">
        <div className="header__title">HI-SCORE</div>
        <div className="header__score">{highScore}</div>
      </div>
    </div>
  );
}
