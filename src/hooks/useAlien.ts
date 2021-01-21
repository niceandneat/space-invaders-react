import { useEffect } from 'react';
import { removeElement, tickBouncer, checkCollision } from 'utils';
import { step, selectAlien, setHitDelay } from 'states/alien';
import { setLife } from 'states/game';
import { coordsToPixels, destroyBlockArea } from 'states/block';
import { TickListener } from './index';

export const useAlien = (ticks: TickListener[]) => {
  // add tick event listener
  useEffect(() => {
    const alienTick: TickListener = (time, store) => {
      const state = store.getState();
      const { game, alien } = state;
      let changeRow = false;
      let stayInRow = false;
      let { cursor, hitDelay } = alien;

      if (hitDelay) {
        hitDelay = Math.max(0, hitDelay - time);
        store.dispatch(setHitDelay(hitDelay));
        return;
      }

      if (alien.matrix[cursor].y >= game.height * 0.95) {
        store.dispatch(setLife(0));
        return;
      }

      do {
        cursor = (cursor + 1) % alien.matrix.length;
        if (cursor === 0) {
          if (alien.dx > 0) {
            const edge = selectAlien.rightMost(state);
            const type = alien.types[edge.type];
            if (edge.x + type.width + alien.xSpeed > game.width) {
              changeRow = true;
            } else {
              stayInRow = true;
            }
          } else {
            const edge = selectAlien.leftMost(state);
            if (edge.x - alien.xSpeed < 0) {
              changeRow = true;
            } else {
              stayInRow = true;
            }
          }
        }
      } while (alien.matrix[cursor].state < 1);

      store.dispatch(step({ cursor, changeRow, stayInRow }));

      checkBlockOverlap(time, store);
    };

    // check if moved alien overlaped with block
    const checkBlockOverlap: TickListener = (time, store) => {
      const state = store.getState();
      const {
        alien,
        block: { blocks },
      } = state;
      const { cursor, matrix, types } = alien;
      const { x, y, type } = matrix[cursor];
      const { width, height } = types[type];

      for (let index = 0; index < blocks.length; index++) {
        const block = blocks[index];
        const minX = block.x;
        const minY = block.y;
        const maxX = block.x + block.width;
        const maxY = block.y + block.height;

        if (checkCollision(x, y, minX, minY, maxX, maxY, width, height)) {
          // alien is in the area that collision can happen
          const y1 = block.y;
          const y2 = y + height + 2;
          const x1 = x;
          const x2 = x + width;

          const [startX, startY] = coordsToPixels(block, x1, y1);
          const [endX, endY] = coordsToPixels(block, x2, y2);

          store.dispatch(
            destroyBlockArea({ index, startY, startX, endX, endY }),
          );

          break;
        }
      }
    };

    ticks.push(tickBouncer(1000 / 30, alienTick));

    return () => removeElement(ticks, alienTick);
  }, [ticks]);
};
