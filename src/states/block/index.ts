import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GAME_WIDTH, GAME_HEIGHT } from 'states/constants';

// types
interface BlockState {
  blocks: Block[];
}

export interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  pixels: number[][];
}

export interface DestroyBlockPayload {
  index: number;
  x: number;
  y: number;
  dy: number;
}

export interface DestroyBlockAreaPayload {
  index: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

// constants
const COUNTS = 4;

const enemyDestroyArea = [
  [1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [0, 1, 1, 1, 0],
  [1, 0, 1, 0, 1],
];

const playerDestroyArea = [
  [0, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 0, 0, 1, 0],
  [1, 0, 0, 0, 1, 0, 1],
];

// initial state
const initialBlockPixels = () => [
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
];

const initialState: BlockState = {
  blocks: initBlocks(COUNTS),
};

// slice
const blockSlice = createSlice({
  name: 'block',
  initialState: initialState,
  reducers: {
    resetBlocks(state) {
      state.blocks = initBlocks(COUNTS);
    },
    destroyBlock(state, { payload }: PayloadAction<DestroyBlockPayload>) {
      const { x, y, index } = payload;
      const block = state.blocks[index];
      const dy = payload.dy > 0 ? 1 : -1;
      const destroyArea = payload.dy > 0 ? enemyDestroyArea : playerDestroyArea;
      const yLimit =
        dy > 0
          ? Math.min(block.pixels.length, y + destroyArea.length) - y
          : y - Math.max(-1, y - destroyArea.length);
      const xStart = Math.max(0, (destroyArea[0].length - 1) / 2 - x);
      const xLimit =
        destroyArea[0].length +
        Math.min(block.pixels[0].length - x - destroyArea[0].length / 2, 0);

      for (let i = 0; i < yLimit; i++) {
        const row = destroyArea[i];
        const half = (row.length - 1) / 2;
        const pixelY = y + i * dy;

        for (let j = xStart; j < xLimit; j++) {
          if (row[j] === 0) {
            continue;
          }

          const pixelX = x + j - half;

          if (block.pixels[pixelY][pixelX]) {
            block.pixels[pixelY][pixelX] = 0;
          }
        }
      }
    },
    destroyBlockArea(
      state,
      { payload }: PayloadAction<DestroyBlockAreaPayload>,
    ) {
      const { index, startX, startY, endX, endY } = payload;
      const block = state.blocks[index];

      for (let i = startY; i <= endY; i++) {
        const row = block.pixels[i];

        for (let j = startX; j <= endX; j++) {
          if (row[j]) {
            row[j] = 0;
          }
        }
      }
    },
  },
});

// action creators
export const {
  resetBlocks,
  destroyBlock,
  destroyBlockArea,
} = blockSlice.actions;

// reducer
export default blockSlice.reducer;

// selector
export * as selectBlock from './selector';

// utility functions
function initBlocks(counts: number) {
  return Array.from({ length: counts }).map((_, i) => ({
    x: ((GAME_WIDTH * 0.8) / counts) * (i + 1) - 6,
    y: (GAME_HEIGHT / 100) * 81,
    width: (9 * 18) / 16,
    height: 9,
    pixels: initialBlockPixels(),
  }));
}

export function coordsToPixels(block: Block, x: number, y: number) {
  const newX = Math.min(
    Math.floor(
      (Math.max(0, Math.min(block.width, x - block.x)) / block.width) *
        block.pixels[0].length,
    ),
    block.pixels[0].length - 1,
  );

  const newY = Math.min(
    Math.floor(
      (Math.max(0, Math.min(block.height, y - block.y)) / block.height) *
        block.pixels.length,
    ),
    block.pixels.length - 1,
  );

  return [newX, newY];
}
