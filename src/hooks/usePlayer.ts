import { useEffect, useCallback } from 'react';
import { removeElement } from 'utils';
import { AppStore } from 'states';
import { setStage, setPause } from 'states/game';
import {
  setX,
  setLeft,
  setRight,
  setShooting,
  selectPlayer,
} from 'states/player';
import { addBeam } from 'states/beam';
import { TickListener } from './index';

export const usePlayer = (ticks: TickListener[], store: AppStore) => {
  // make player input event handlers
  const playerLeftDownHandler = useCallback(
    (e: Event) => {
      e.preventDefault();
      const gameState = store.getState().game;
      if (gameState.stage === 0) {
        store.dispatch(setStage(1));
        store.dispatch(setPause(false));
      }
      if (gameState.pause) {
        return;
      }

      store.dispatch(setLeft(true));
    },
    [store],
  );

  const playerRightDownHandler = useCallback(
    (e: Event) => {
      e.preventDefault();
      const gameState = store.getState().game;
      if (gameState.stage === 0) {
        store.dispatch(setStage(1));
        store.dispatch(setPause(false));
      }
      if (gameState.pause) {
        return;
      }

      store.dispatch(setRight(true));
    },
    [store],
  );

  const playerFireDownHandler = useCallback(
    (e: Event) => {
      e.preventDefault();
      const state = store.getState();
      const gameState = store.getState().game;

      if (gameState.stage === 0) {
        store.dispatch(setStage(1));
        store.dispatch(setPause(false));
      }
      if (gameState.pause) {
        return;
      }
      if (state.player.shooting) {
        return;
      }

      store.dispatch(setShooting(true));
      store.dispatch(
        addBeam({
          type: 0,
          x: selectPlayer.x(state) + state.player.width / 2,
          y: selectPlayer.y(state) - state.player.height / 2,
        }),
      );
    },
    [store],
  );

  const playerLeftUpHandler = useCallback(
    (e: Event) => {
      e.preventDefault();
      const gameState = store.getState().game;

      if (gameState.pause) {
        return;
      }

      store.dispatch(setLeft(false));
    },
    [store],
  );

  const playerRightUpHandler = useCallback(
    (e: Event) => {
      e.preventDefault();
      const gameState = store.getState().game;

      if (gameState.pause) {
        return;
      }

      store.dispatch(setRight(false));
    },
    [store],
  );

  // add keyboard event listeners
  useEffect(() => {
    const playerKeyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        playerLeftDownHandler(event);
      } else if (event.key === 'ArrowRight') {
        playerRightDownHandler(event);
      } else if (event.key === 'Control') {
        playerFireDownHandler(event);
      } else {
        const gameState = store.getState().game;
        if (gameState.stage === 0) {
          store.dispatch(setStage(1));
          store.dispatch(setPause(false));
        }
      }
    };

    const playerKeyUpHandler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        playerLeftUpHandler(event);
      } else if (event.key === 'ArrowRight') {
        playerRightUpHandler(event);
      }
    };

    window.addEventListener('keydown', playerKeyDownHandler);
    window.addEventListener('keyup', playerKeyUpHandler);

    return () => {
      window.removeEventListener('keydown', playerKeyDownHandler);
      window.removeEventListener('keyup', playerKeyUpHandler);
    };
  }, [
    store,
    playerFireDownHandler,
    playerLeftDownHandler,
    playerLeftUpHandler,
    playerRightDownHandler,
    playerRightUpHandler,
  ]);

  // add tick event listener
  useEffect(() => {
    const playerTick: TickListener = (time, store) => {
      const { game, player } = store.getState();
      const max = game.width - player.width * 1.5;
      const min = player.width / 2;
      const x = Math.min(
        Math.max(player.x + player.speed * (time / 1000) * player.dx, min),
        max,
      );

      store.dispatch(setX(x));
    };

    ticks.push(playerTick);

    return () => removeElement(ticks, playerTick);
  }, [ticks]);

  return {
    playerFireDownHandler,
    playerLeftDownHandler,
    playerLeftUpHandler,
    playerRightDownHandler,
    playerRightUpHandler,
  };
};
