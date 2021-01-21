import { useEffect } from 'react';
import { removeElement, checkCollision } from 'utils';
import {
  removeBeam,
  step,
  setBeamDelay,
  addBeam,
  BeamType,
  BeamRemovePayload,
  resetBeam,
} from 'states/beam';
import { killAlien, setHitDelay, selectAlien } from 'states/alien';
import {
  setShooting,
  setIsHit,
  selectPlayer,
  resetPlayer,
} from 'states/player';
import { hitBonus } from 'states/bonus';
import { destroyBlock, coordsToPixels } from 'states/block';
import { addLife, addScore, setPause } from 'states/game';
import { TickListener } from './index';

export const useBeam = (ticks: TickListener[]) => {
  // add tick event listener
  useEffect(() => {
    // make beams for aliens
    const beamGenerateTick: TickListener = (time, store) => {
      const state = store.getState();
      const { beamDelay, beamFrequency } = state.beam;
      const newDelay = Math.max(0, beamDelay - time);

      if (newDelay > 0) {
        store.dispatch(setBeamDelay(newDelay));
      } else {
        if (state.alien.counts > 0) {
          const lowestAliens = selectAlien.lowestAliens(state);
          const alien =
            lowestAliens[Math.floor(Math.random() * lowestAliens.length)];
          const { width } = state.alien.types[alien.type];
          store.dispatch(
            addBeam({
              type: Math.floor(Math.random() * 3 + 1) as BeamType,
              x: alien.x + width / 2,
              y: alien.y + state.alien.ySpeed,
            }),
          );
          store.dispatch(setBeamDelay(beamFrequency));
        }
      }
    };

    // check collision
    const beamCollisionTick: TickListener = (time, store) => {
      for (const beam of store.getState().beam.beams) {
        // skip booming beams
        if (beam.type > 3) continue;

        const removedBeams: BeamRemovePayload[] = [];
        const { x, shootDelay } = beam;
        const preY = beam.y + (beam.dy * time) / 1000;
        const y = beam.type === 0 ? preY : preY + beam.height;
        const state = store.getState();

        const delaySetShooting = () => {
          window.setTimeout(() => {
            store.dispatch(setShooting(false));
          }, shootDelay);
        };

        // if beam is from player
        if (beam.type === 0) {
          // check collision with other beams
          for (const otherBeam of state.beam.beams) {
            if (otherBeam.type === 0 || otherBeam.type > 3) continue;

            const minX = otherBeam.x;
            const maxX = otherBeam.x + otherBeam.width;
            const minY = otherBeam.y;
            const maxY = otherBeam.y + otherBeam.height;

            if (checkCollision(x, y, minX, minY, maxX, maxY, beam.width)) {
              // collision with otherBeam has happened
              removedBeams.push({ id: beam.id, type: 4 }, { id: otherBeam.id });
              delaySetShooting();
              break;
            }
          }

          // check collision with aliens
          if (removedBeams.length === 0) {
            for (const alien of state.alien.matrix) {
              if (alien.state < 1) continue;

              const type = state.alien.types[alien.type];
              const minX = alien.x;
              const maxX = alien.x + type.width;
              const minY = alien.y;
              const maxY = alien.y + type.height;

              if (checkCollision(x, y, minX, minY, maxX, maxY, beam.width)) {
                // collision with alien has happened
                removedBeams.push({ id: beam.id });
                store.dispatch(addScore(state.alien.types[alien.type].score));
                store.dispatch(killAlien(alien.id));
                store.dispatch(setHitDelay(200));
                delaySetShooting();
                break;
              }
            }
          }

          // check collision with bonus ship
          if (removedBeams.length === 0) {
            const { bonus } = state;
            const minX = bonus.x;
            const maxX = bonus.x + bonus.width;
            const minY = 0;
            const maxY = bonus.height;

            if (checkCollision(x, y, minX, minY, maxX, maxY, beam.width)) {
              // collision with bonus ship has happened
              removedBeams.push({ id: beam.id });
              store.dispatch(addScore(bonus.score));
              store.dispatch(hitBonus());

              delaySetShooting();
            }
          }
        } else {
          // if beam is from alien

          // check collision with player
          const minX = state.player.x;
          const maxX = state.player.x + state.player.width;
          const minY = selectPlayer.y(state) + state.player.height / 2;
          const maxY = minY + state.player.height / 2;

          if (checkCollision(x, y, minX, minY, maxX, maxY, beam.width)) {
            // collision with player has happened
            removedBeams.push({ id: beam.id });
            store.dispatch(addLife(-1));
            store.dispatch(setIsHit(true));

            // check if player's life is below one
            if (store.getState().game.life > 0) {
              store.dispatch(setPause(true));
              window.setTimeout(() => {
                store.dispatch(resetBeam());
                store.dispatch(resetPlayer());
                store.dispatch(setPause(false));
              }, 2000);
            }
          }
        }

        // check collsion with block
        if (removedBeams.length === 0) {
          const {
            block: { blocks },
          } = state;

          const prevY = y - (beam.dy * time) / 1000;

          for (let index = 0; index < blocks.length; index++) {
            const block = blocks[index];
            const minX = block.x;
            const minY = block.y;
            const maxX = block.x + block.width;
            const maxY = block.y + block.height;

            if (checkCollision(x, y, minX, minY, maxX, maxY, beam.width)) {
              // beam's one end is in the area that collision can happen
              const yStart = prevY;
              const yEnd = y;
              const xStart = x;
              const xEnd = x + beam.width;

              const [pixelXStart, pixelYStart] = coordsToPixels(
                block,
                xStart,
                yStart,
              );
              const [pixelXEnd, pixelYEnd] = coordsToPixels(block, xEnd, yEnd);

              const dy = beam.dy > 0 ? 1 : -1;

              for (
                let pixelY = pixelYStart;
                pixelY !== pixelYEnd + dy;
                pixelY += dy
              ) {
                let shouldBreak = false;

                for (let pixelX = pixelXStart; pixelX <= pixelXEnd; pixelX++) {
                  if (block.pixels[pixelY][pixelX]) {
                    // collision with block has happened
                    store.dispatch(
                      destroyBlock({
                        index,
                        x: pixelX,
                        y: pixelY,
                        dy: beam.dy,
                      }),
                    );
                    removedBeams.push({ id: beam.id });
                    if (beam.type === 0) {
                      delaySetShooting();
                    }

                    shouldBreak = true;
                    break;
                  }
                }

                if (shouldBreak) {
                  break;
                }
              }
            }
          }
        }

        // get out of the game screen;
        if (y > state.game.height) {
          removedBeams.push({ id: beam.id, type: 5 });

          if (beam.type === 0) {
            delaySetShooting();
          }
        } else if (y < 0) {
          removedBeams.push({ id: beam.id, type: 6 });

          if (beam.type === 0) {
            delaySetShooting();
          }
        }

        if (removedBeams.length) {
          store.dispatch(removeBeam(removedBeams));
        } else {
          store.dispatch(step({ id: beam.id, y: preY }));
        }
      }
    };

    ticks.push(beamGenerateTick);
    ticks.push(beamCollisionTick);

    return () => {
      removeElement(ticks, beamGenerateTick);
      removeElement(ticks, beamCollisionTick);
    };
  }, [ticks]);
};
