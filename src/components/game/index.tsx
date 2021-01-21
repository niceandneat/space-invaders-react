import React from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { selectGame } from 'states/game';
import { useGame } from 'hooks';

import { Footer } from './footer';
import { Header } from './header';
import { Stage } from './stage';
import { LeftButton, RightButton, FireButton } from '../button';

import './style.css';

export function Game() {
  const { stageRef, inputs } = useGame();

  const isVertical = useSelector(selectGame.isVertical);
  const gameWidth = useSelector(selectGame.gameWidth);
  const gameHeight = useSelector(selectGame.gameHeight);
  const fontSize = gameWidth / 20;

  const style: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    width: `${gameWidth}px`,
    height: `${gameHeight}px`,
  };

  return (
    <div
      className={cn('game__container', {
        ['game__container--vertical']: isVertical,
      })}
    >
      <div
        className={cn('game', {
          ['game--horizontal']: !isVertical,
        })}
        style={style}
      >
        <Header></Header>
        <Stage ref={stageRef}></Stage>
        <Footer></Footer>
      </div>
      <ButtonContainer
        isVertical={isVertical}
        left={
          <LeftButton
            onPointerDown={inputs.playerLeftDownHandler}
            onPointerUp={inputs.playerLeftUpHandler}
            isVertical={isVertical}
          />
        }
        right={
          <RightButton
            onPointerDown={inputs.playerRightDownHandler}
            onPointerUp={inputs.playerRightUpHandler}
            isVertical={isVertical}
          />
        }
        fire={
          <FireButton
            onPointerDown={inputs.playerFireDownHandler}
            isVertical={isVertical}
          />
        }
      ></ButtonContainer>
    </div>
  );
}

type ButtonContainerProps = {
  isVertical: boolean;
  left: React.ReactNode;
  right: React.ReactNode;
  fire: React.ReactNode;
};

function ButtonContainer({
  isVertical,
  left,
  right,
  fire,
}: ButtonContainerProps) {
  return isVertical ? (
    <div className="game__buttons--vertical">
      {left}
      {right}
      {fire}
    </div>
  ) : (
    <>
      <div className="game__move-buttons--horizontal">
        {left}
        {right}
      </div>
      <div className="game__fire-buttons--horizontal">{fire}</div>
    </>
  );
}
