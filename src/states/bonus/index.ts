import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
interface BonusState {
  x: number;
  dx: number;
  width: number;
  height: number;
  speed: number;
  delay: number;
  limit: number;
  score: number;
  hit: boolean;
}

interface InitBonusOptions {
  x: number;
  dx: number;
  score: number;
}

// initial state
const initialState: BonusState = {
  x: -100,
  dx: 0,
  width: 8,
  height: 7 / 2,
  speed: 30,
  delay: 25000,
  limit: 25000,
  score: 100,
  hit: false,
};

// slice
const bonusSlice = createSlice({
  name: 'bonux',
  initialState,
  reducers: {
    resetBonus(state) {
      state.x = initialState.x;
      state.dx = initialState.dx;
      state.score = initialState.score;
      state.delay = initialState.delay;
      state.hit = initialState.hit;
    },
    initBonus(state, { payload }: PayloadAction<InitBonusOptions>) {
      state.x = payload.x;
      state.dx = payload.dx;
      state.score = payload.score;
      state.delay = state.limit;
      state.hit = false;
    },
    setX(state, { payload }: PayloadAction<number>) {
      state.x = payload;
    },
    hitBonus(state) {
      state.dx = 0;
      state.hit = true;
    },
    addDelay(state, { payload }: PayloadAction<number>) {
      state.delay += payload;

      if (state.delay >= state.limit) {
        state.delay = 0;
      }
    },
  },
});

// action creators
export const {
  resetBonus,
  initBonus,
  setX,
  hitBonus,
  addDelay,
} = bonusSlice.actions;

// reducer
export default bonusSlice.reducer;

// selector
export * as selectBonus from './selector';
