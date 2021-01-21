import { AppState } from '../index';
import { ratio } from '../game/selector';

export const blocks = (state: AppState) => state.block.blocks;

export const display = (state: AppState) => {
  const r = ratio(state);
  const {
    block: { blocks },
  } = state;

  return blocks.map((block) => ({
    ...block,
    x: block.x * r,
    y: block.y * r,
    width: block.width * r,
    height: block.height * r,
  }));
};
