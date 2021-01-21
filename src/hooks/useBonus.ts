import { useEffect } from 'react';
import { removeElement } from 'utils';
import { resetBonus, setX, addDelay, initBonus } from 'states/bonus';
import { TickListener } from './index';

export const useBonus = (ticks: TickListener[]) => {
  // add tick event listener
  useEffect(() => {
    const bonusTick: TickListener = (time, store) => {
      store.dispatch(addDelay(-time));

      if (store.getState().bonus.delay < 0) {
        const dx = Math.random() > 0.5 ? 1 : -1;
        const score = Math.floor(Math.random() * 11) * 10 + 100;
        const x =
          dx > 0
            ? 0
            : store.getState().game.width - store.getState().bonus.width;
        store.dispatch(initBonus({ dx, score, x }));
      } else if (store.getState().bonus.dx === 0) {
        // skip when it is not on the screen
        return;
      }

      const { game, bonus } = store.getState();

      const max = game.width - bonus.width;
      const min = 0;
      const newX = bonus.x + bonus.dx * bonus.speed * (time / 1000);

      if (newX < min || newX > max) {
        store.dispatch(resetBonus());
      } else {
        store.dispatch(setX(newX));
      }
    };

    ticks.push(bonusTick);

    return () => removeElement(ticks, bonusTick);
  }, [ticks]);
};
