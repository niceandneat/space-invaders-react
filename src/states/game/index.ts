import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GAME_WIDTH, GAME_HEIGHT } from 'states/constants';

// types
interface GameState {
  readonly width: number;
  readonly height: number;
  screenWidth: number;
  screenHeight: number;
  gameWidth: number;
  gameHeight: number;
  stageWidth: number;
  stageHeight: number;
  score: number;
  highScore: number;
  stage: number;
  life: number;
  pause: boolean;
  message?: string;
}

// initial state
const initialState: GameState = {
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  screenWidth: 0,
  screenHeight: 0,
  gameWidth: 0,
  gameHeight: 0,
  stageWidth: 0,
  stageHeight: 0,
  score: 0,
  highScore: 0,
  stage: 0,
  life: 3,
  pause: true,
  message: undefined,
};

// slice
const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    resetGame(state) {
      state.highScore = state.score;
      state.score = initialState.score;
      state.stage = initialState.stage;
      state.life = initialState.life;
      state.pause = initialState.pause;
      state.message = initialState.message;
    },
    setScreenSize(state, { payload }: PayloadAction<[number, number]>) {
      state.screenWidth = payload[0];
      state.screenHeight = payload[1];

      // set game size based on screen ratio
      if (state.screenHeight / state.screenWidth > 1.6) {
        // if height is longer
        state.gameWidth = state.screenWidth;
        state.gameHeight = (state.gameWidth * 5) / 4;
      } else if (state.screenHeight / state.screenWidth > 2 / 3) {
        // if it is too narrow to render buttons
        state.gameHeight = (state.screenHeight * 2) / 3;
        state.gameWidth = (state.gameHeight * 4) / 5;
      } else {
        // if width is longer
        state.gameHeight = state.screenHeight;
        state.gameWidth = (state.gameHeight * 4) / 5;
      }
    },
    setStageSize(state, { payload }: PayloadAction<[number, number]>) {
      state.stageWidth = payload[0];
      state.stageHeight = payload[1];
    },
    setScore(state, { payload }: PayloadAction<number>) {
      state.score = payload;
    },
    addScore(state, { payload }: PayloadAction<number>) {
      state.score += payload;
    },
    setStage(state, { payload }: PayloadAction<number>) {
      state.stage = payload;
    },
    addStage(state, { payload }: PayloadAction<number>) {
      state.stage += payload;
    },
    setLife(state, { payload }: PayloadAction<number>) {
      state.life = payload;
    },
    addLife(state, { payload }: PayloadAction<number>) {
      state.life += payload;
    },
    setPause(state, { payload }: PayloadAction<boolean>) {
      state.pause = payload;
    },
    setMessage(state, { payload }: PayloadAction<string | undefined>) {
      state.message = payload;
    },
  },
});

// action creators
export const {
  resetGame,
  setScreenSize,
  setStageSize,
  setScore,
  addScore,
  setStage,
  addStage,
  setLife,
  addLife,
  setPause,
  setMessage,
} = gameSlice.actions;

// reducer
export default gameSlice.reducer;

// selector
export * as selectGame from './selector';
