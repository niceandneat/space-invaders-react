import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
interface PlayerState {
  x: number;
  dx: number;
  width: number;
  height: number;
  speed: number;
  left: boolean;
  right: boolean;
  hit: boolean;
  shooting: boolean;
}

// initial state
const initialState: PlayerState = {
  x: 0,
  dx: 0,
  width: 15 / 2,
  height: 4,
  speed: 50,
  left: false,
  right: false,
  hit: false,
  shooting: false,
};

// slice
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    resetPlayer(state) {
      state.x = initialState.x;
      state.dx = initialState.dx;
      state.left = initialState.left;
      state.right = initialState.right;
      state.hit = initialState.hit;
      state.shooting = initialState.hit;
    },
    setX(state, { payload }: PayloadAction<number>) {
      state.x = payload;
    },
    moveX(state, { payload }: PayloadAction<number>) {
      state.x += payload;
    },
    setWidth(state, { payload }: PayloadAction<number>) {
      state.width = payload;
    },
    setHeight(state, { payload }: PayloadAction<number>) {
      state.height = payload;
    },
    setSpeed(state, { payload }: PayloadAction<number>) {
      state.speed = payload;
    },
    setLeft(state, { payload }: PayloadAction<boolean>) {
      state.left = payload;
      if (state.left) {
        state.dx = -1;
      } else if (state.right) {
        state.dx = 1;
      } else {
        state.dx = 0;
      }
    },
    setRight(state, { payload }: PayloadAction<boolean>) {
      state.right = payload;
      if (state.right) {
        state.dx = 1;
      } else if (state.left) {
        state.dx = -1;
      } else {
        state.dx = 0;
      }
    },
    setIsHit(state, { payload }: PayloadAction<boolean>) {
      state.hit = payload;
    },
    setShooting(state, { payload }: PayloadAction<boolean>) {
      state.shooting = payload;
    },
  },
});

// action creators
export const {
  resetPlayer,
  setX,
  moveX,
  setLeft,
  setRight,
  setWidth,
  setSpeed,
  setHeight,
  setIsHit,
  setShooting,
} = playerSlice.actions;

// reducer
export default playerSlice.reducer;

// selector
export * as selectPlayer from './selector';
