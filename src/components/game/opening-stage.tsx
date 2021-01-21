import React from 'react';
import {
  AnimationManager,
  AnimationShow,
  AnimationDelay,
} from 'components/animation';

import bonus from 'images/ship.png';
import jelly from 'images/alien_0-2.png';
import crab from 'images/alien_1-1.png';
import octo from 'images/alien_2-2.png';

const playLetters = stringToLetters('PLAY');
const titleLetters = stringToLetters('SPACE INVADERS');
const bonusPointsLetters = stringToLetters('=? MYSTERY');
const jellyPointsLetters = stringToLetters('=30 POINTS');
const crabPointsLetters = stringToLetters('=20 POINTS');
const octoPointsLetters = stringToLetters('=10 POINTS');
const scoreString = '*SCORE ADVANCE TABLE*';
const pressString = 'PRESS ANY BUTTON';

const frameInterval = 200;

export function OpeningStage() {
  return (
    <AnimationManager>
      <AnimationShow
        className="opening-stage__line"
        showClassName="opening-stage__item--show"
        style={{ top: '90%', fontSize: '0.7em' }}
        interval={frameInterval * 3}
        repeat={true}
      >
        {pressString}
      </AnimationShow>
      <AnimationShow
        className="opening-stage__line"
        showClassName="opening-stage__item--show"
        style={{ top: '10%' }}
        interval={frameInterval}
      >
        {playLetters}
      </AnimationShow>
      <AnimationShow
        className="opening-stage__line"
        showClassName="opening-stage__item--show"
        style={{ top: '20%' }}
        interval={frameInterval}
      >
        {titleLetters}
      </AnimationShow>
      <AnimationDelay interval={frameInterval} delay={5}></AnimationDelay>
      <AnimationShow
        className="opening-stage__rect"
        showClassName="opening-stage__item--show"
        style={{ fontSize: '0.9em' }}
        interval={frameInterval}
        delay={-1}
      >
        <ScoreTable></ScoreTable>
      </AnimationShow>
      <AnimationShow
        className="opening-stage__line"
        showClassName="opening-stage__item--show"
        style={{ top: '50%', left: '6%', fontSize: '0.9em' }}
        interval={frameInterval}
      >
        {bonusPointsLetters}
      </AnimationShow>
      <AnimationShow
        className="opening-stage__line"
        showClassName="opening-stage__item--show"
        style={{ top: '60%', left: '6%', fontSize: '0.9em' }}
        interval={frameInterval}
      >
        {jellyPointsLetters}
      </AnimationShow>
      <AnimationShow
        className="opening-stage__line"
        showClassName="opening-stage__item--show"
        style={{ top: '70%', left: '6%', fontSize: '0.9em' }}
        interval={frameInterval}
      >
        {crabPointsLetters}
      </AnimationShow>
      <AnimationShow
        className="opening-stage__line"
        showClassName="opening-stage__item--show"
        style={{ top: '80%', left: '6%', fontSize: '0.9em' }}
        interval={frameInterval}
      >
        {octoPointsLetters}
      </AnimationShow>
    </AnimationManager>
  );
}

function ScoreTable() {
  return (
    <div className="opening-stage__container">
      <div
        className="opening-stage__line"
        style={{ top: '40%', color: '#ffffff' }}
      >
        {scoreString}
      </div>
      <ScoreIconImage
        src={bonus}
        alt="bonus"
        style={{ top: '50%', left: '21%' }}
      ></ScoreIconImage>
      <ScoreIconImage
        src={jelly}
        alt="jelly"
        style={{ top: '60%', left: '21%' }}
      ></ScoreIconImage>
      <ScoreIconImage
        src={crab}
        alt="crab"
        style={{ top: '70%', left: '21%' }}
      ></ScoreIconImage>
      <ScoreIconImage
        src={octo}
        alt="octo"
        style={{ top: '80%', left: '21%' }}
      ></ScoreIconImage>
    </div>
  );
}

type ScoreIconImageProps = {
  src: string;
  alt: string;
  style?: React.CSSProperties;
};

function ScoreIconImage({ src, alt, style }: ScoreIconImageProps) {
  return (
    <div className="opening-stage__score-icon-container" style={style}>
      <img
        src={src}
        alt={alt}
        className="opening-stage__score-icon pixel-perfect"
      ></img>
    </div>
  );
}

export function stringToLetters(s: string) {
  return s.split('');
}
