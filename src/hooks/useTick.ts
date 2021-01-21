import { useState, useEffect } from 'react';
import { AppStore } from 'states';

export type TickListener = (time: number, store: AppStore) => void;

export const useTick = (store: AppStore) => {
  const [tickListeners] = useState<TickListener[]>([]);

  useEffect(() => {
    window.requestAnimationFrame(tickFactory());

    function tickFactory() {
      let prevTime = 0;

      function tick(time: number) {
        window.requestAnimationFrame(tick);

        // disable game logic when game is on pause state
        if (store.getState().game.pause) {
          prevTime = time;
          return;
        }

        const delta = time - (prevTime || time);
        tickListeners.forEach((listener) => listener(delta, store));
        prevTime = time;
      }

      return tick;
    }
  }, [tickListeners, store]);

  return tickListeners;
};
