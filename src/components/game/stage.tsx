import React from 'react';
import { useSelector } from 'react-redux';
import { selectGame } from 'states/game';

import { Player } from '../player';
import { Aliens } from '../alien';
import { Beams } from '../beam';
import { Bonus } from '../bonus';
import { Blocks } from '../block';
import { Message } from '../message';
import { OpeningStage } from './opening-stage';

export const Stage = React.forwardRef<HTMLDivElement>((props, ref) => {
  const stage = useSelector(selectGame.stage);

  const childStage = () => {
    switch (stage) {
      case 0:
        return <OpeningStage />;
      default:
        return <PlayingStage />;
    }
  };

  return (
    <div ref={ref} className="stage">
      {childStage()}
    </div>
  );
});

Stage.displayName = 'Stage';

function PlayingStage() {
  return (
    <>
      <Aliens></Aliens>
      <Player></Player>
      <Beams></Beams>
      <Bonus></Bonus>
      <Blocks></Blocks>
      <Message></Message>
    </>
  );
}
