import { createSlice, PayloadAction, Draft } from '@reduxjs/toolkit';

// types
interface AlienState {
  matrix: Alien[];
  counts: number;
  cursor: number;
  dx: number;
  dy: number;
  leftMost: number;
  rightMost: number;
  hitDelay: number;
  readonly row: number;
  readonly col: number;
  readonly xGap: number;
  readonly yGap: number;
  readonly xSpeed: number;
  readonly ySpeed: number;
  readonly types: AlienType[];
}

export interface Alien {
  id: number;
  x: number;
  y: number;
  state:
    | -1 // dead
    | 0 // dying
    | 1 // alive: shape 1
    | 2; // alive: shape 2
  type:
    | 0 // octo
    | 1 // crab
    | 2 // jelly
    | 3; // boom
}
export interface AlienType {
  name: string;
  width: number;
  height: number;
  score: number;
}
export interface AlienStepPayload {
  cursor: number;
  changeRow: boolean;
  stayInRow: boolean;
}

// initial state
const ROW = 5;
const COL = 11;
const XGAP = 8;
const YGAP = 10;
const alienTypes = [
  {
    name: 'octo',
    width: 6,
    height: 4,
    score: 10,
  },
  {
    name: 'crab',
    width: 5.5,
    height: 4,
    score: 20,
  },
  {
    name: 'jelly',
    width: 5,
    height: 4,
    score: 30,
  },
  {
    name: 'boom',
    width: 6.5,
    height: 4,
    score: 0,
  },
];

const initialState: AlienState = {
  matrix: makeAlienMatrix(ROW, COL, XGAP, YGAP),
  counts: ROW * COL,
  cursor: ROW * COL - 1,
  dx: 1,
  dy: 0,
  leftMost: 0,
  rightMost: COL - 1,
  hitDelay: 0,
  row: ROW,
  col: COL,
  xGap: XGAP,
  yGap: YGAP,
  xSpeed: 2,
  ySpeed: 5,
  types: alienTypes,
};

// slice
const alienSlice = createSlice({
  name: 'alien',
  initialState,
  reducers: {
    resetAliens: resetAlienState,
    killAlien(state, { payload }: PayloadAction<number>) {
      const index = state.matrix.findIndex((a) => a.id === payload);
      if (index < 0) return;
      state.matrix[index].state = 0;
      state.matrix[index].type = 3;
      state.counts -= 1;

      if (state.counts !== 0) {
        state.rightMost = findRightMost(state);
        state.leftMost = findLeftMost(state);
      }
    },
    step(state, { payload }: PayloadAction<AlienStepPayload>) {
      if (state.counts === 0) return;

      if (payload.changeRow) {
        state.dx *= -1;
        state.dy = 1;
      } else if (payload.stayInRow) {
        state.dy = 0;
      }

      state.cursor = payload.cursor;
      const alien = state.matrix[state.cursor];
      alien.x += state.xSpeed * state.dx;
      alien.y += state.ySpeed * state.dy;
      alien.state = alien.state === 1 ? 2 : 1;
    },
    setHitDelay(state, { payload }: PayloadAction<number>) {
      state.hitDelay = payload;

      if (state.hitDelay === 0) {
        // make dying alien finally dead
        for (const alien of state.matrix) {
          if (alien.state === 0) {
            alien.state = -1;
            break;
          }
        }
      }
    },
  },
});

function resetAlienState(
  state: Draft<AlienState>,
  { payload }: { payload: number },
) {
  state.matrix = makeAlienMatrix(
    state.row,
    state.col,
    state.xGap,
    state.yGap,
    payload,
  );
  state.counts = state.matrix.length;
  state.cursor = state.matrix.length - 1;
  state.dx = 1;
  state.dy = 0;
  state.leftMost = 0;
  state.rightMost = 10;
  state.hitDelay = 0;
}

// action creators
export const { resetAliens, killAlien, step, setHitDelay } = alienSlice.actions;

// reducer
export default alienSlice.reducer;

// selectors
export * as selectAlien from './selector';

// utility functions
function makeAlienMatrix(
  rowLimit: number,
  colLimit: number,
  xGap: number,
  yGap: number,
  yOffset = 1,
) {
  const matrix: Alien[] = [];
  for (let row = 0; row < rowLimit; row++) {
    const type = selectType(row);
    for (let col = 0; col < colLimit; col++) {
      matrix[row * 11 + col] = {
        id: row * 11 + col,
        x: col * xGap,
        y: (4 - row + yOffset) * yGap,
        state: 1,
        type,
      };
    }
  }
  return matrix;
}

function selectType(row: number) {
  if (row < 2) {
    return 0;
  } else if (row < 4) {
    return 1;
  } else {
    return 2;
  }
}

function findLeftMost(state: AlienState) {
  let result = 0;
  let min = Infinity;

  for (let i = 0; i < state.matrix.length; i++) {
    // Skip if it is dead
    if (state.matrix[i].state < 1) continue;

    const x = state.matrix[i].x;
    if (x < min) {
      min = x;
      result = i;
    }
  }

  return result;
}

function findRightMost(state: AlienState) {
  let result = 0;
  let max = -Infinity;

  for (let i = 0; i < state.matrix.length; i++) {
    // Skip if it is dead
    if (state.matrix[i].state < 1) continue;

    const x = state.matrix[i].x;
    if (x > max) {
      max = x;
      result = i;
    }
  }

  return result;
}
