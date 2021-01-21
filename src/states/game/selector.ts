import { AppState } from '../index';

export const stageWidth = (state: AppState) => state.game.stageWidth;
export const stageHeight = (state: AppState) => state.game.stageHeight;
export const gameWidth = (state: AppState) => state.game.gameWidth;
export const gameHeight = (state: AppState) => state.game.gameHeight;
export const stage = (state: AppState) => state.game.stage;
export const score = (state: AppState) => state.game.score;
export const highScore = (state: AppState) => state.game.highScore;
export const life = (state: AppState) => state.game.life;
export const pause = (state: AppState) => state.game.pause;
export const message = (state: AppState) => state.game.message;

export const ratio = (state: AppState) =>
  state.game.stageWidth / state.game.width;

export const isVertical = (state: AppState) =>
  state.game.screenHeight > state.game.screenWidth;
