import { AppState } from '../index';
import { ratio } from '../game/selector';

export const x = (state: AppState) => state.player.x;
export const y = (state: AppState) => state.game.height - state.player.height;

export const display = (state: AppState) => {
  const r = ratio(state);
  const { player } = state;

  return {
    ...player,
    x: player.x * r,
    y: y(state) * r,
    width: player.width * r,
    height: player.height * r,
    speed: player.speed * r,
  };
};

type DisplayReturn = ReturnType<typeof display>;

export const displayEquals = (left: DisplayReturn, right: DisplayReturn) =>
  left.x === right.x && left.dx === right.dx && left.hit === right.hit;
