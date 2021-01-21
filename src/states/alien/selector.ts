import { AppState } from '../index';
import { ratio } from '../game/selector';
import { Alien } from './index';

export const leftMost = (state: AppState) =>
  state.alien.matrix[state.alien.leftMost];

export const rightMost = (state: AppState) =>
  state.alien.matrix[state.alien.rightMost];

export const display = (state: AppState) => {
  const r = ratio(state);

  return state.alien.matrix.map((alien) => displayAlien(alien, r));
};

export const displayType = (state: AppState) => {
  const r = ratio(state);

  return state.alien.types.map((type) => ({
    ...type,
    width: type.width * r,
    height: type.height * r,
  }));
};

const displayAlien = (alien: Alien, r: number) => {
  return {
    ...alien,
    x: alien.x * r,
    y: alien.y * r,
  };
};

function* generateLowestAliens(state: AppState) {
  for (let col = 0; col < state.alien.col; col++) {
    for (let row = 0; row < state.alien.row; row++) {
      const alien = state.alien.matrix[row * state.alien.col + col];
      if (alien.state > 0) {
        yield alien;
        break;
      }
    }
  }
}

export const lowestAliens = (state: AppState) => {
  return Array.from(generateLowestAliens(state));
};
