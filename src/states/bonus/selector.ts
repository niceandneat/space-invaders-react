import { AppState } from '../index';
import { ratio } from '../game/selector';

export const x = (state: AppState) => state.bonus.x;
export const y = (state: AppState) => 0;

export const display = (state: AppState) => {
  const r = ratio(state);
  const { bonus } = state;

  return {
    ...bonus,
    x: bonus.x * r,
    y: y(state) * r,
    width: bonus.width * r,
    height: bonus.height * r,
    speed: bonus.speed * r,
  };
};

type DisplayReturn = ReturnType<typeof display>;

export const displayEquals = (left: DisplayReturn, right: DisplayReturn) =>
  left.x === right.x && left.dx === right.dx && left.hit === right.hit;
