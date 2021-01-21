import { useEffect } from 'react';
import { removeElement } from 'utils';
import { resetAliens } from 'states/alien';
import { resetBeam } from 'states/beam';
import { resetPlayer } from 'states/player';
import { resetBonus } from 'states/bonus';
import { resetBlocks } from 'states/block';
import { setPause, setMessage, resetGame } from 'states/game';
import { TickListener } from './index';

export const useRule = (ticks: TickListener[]) => {
  // add tick event listener
  useEffect(() => {
    const ruleTick: TickListener = (time, store) => {
      const state = store.getState();
      const { game, alien } = state;

      // if life count is zero or below
      if (game.life < 1) {
        // game over
        store.dispatch(setPause(true));
        store.dispatch(setMessage('GAME OVER'));

        window.setTimeout(() => {
          store.dispatch(resetAliens(1));
          store.dispatch(resetPlayer());
          store.dispatch(resetBeam());
          store.dispatch(resetBonus());
          store.dispatch(resetBlocks());
          store.dispatch(resetGame());
        }, 2000);
        return;
      }

      // if destroy all aliens
      if (alien.counts < 1) {
        // go to next level
        store.dispatch(setPause(true));
        store.dispatch(setMessage('COMPLETE LEVEL'));

        window.setTimeout(() => {
          store.dispatch(resetAliens(2));
          store.dispatch(resetPlayer());
          store.dispatch(resetBeam());
          store.dispatch(resetBonus());
          store.dispatch(resetBlocks());
          store.dispatch(setMessage());
          store.dispatch(setPause(false));
        }, 2000);
        return;
      }
    };

    ticks.push(ruleTick);

    return () => removeElement(ticks, ruleTick);
  }, [ticks]);
};
