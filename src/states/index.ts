import { configureStore, combineReducers, AnyAction } from '@reduxjs/toolkit';
import { batch as reduxBatch } from 'react-redux';
import game from './game';
import player from './player';
import alien from './alien';
import beam from './beam';
import bonus from './bonus';
import block from './block';

export const reducer = combineReducers({
  game,
  player,
  alien,
  beam,
  bonus,
  block,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export function batch(dispatch: AppDispatch, actions: AnyAction[] | AnyAction) {
  if (Array.isArray(actions)) {
    reduxBatch(() => {
      actions.forEach((a) => dispatch(a));
    });
  } else {
    reduxBatch(() => {
      dispatch(actions);
    });
  }
}

export type AppState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
