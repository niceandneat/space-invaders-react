import { useDispatch, useStore } from 'react-redux';
import { AppState, AppDispatch } from 'states';
import {
  useTick,
  useResize,
  usePlayer,
  useAlien,
  useBeam,
  useBonus,
  useRule,
} from './index';

export const useGame = () => {
  const store = useStore<AppState>();
  const dispatch = useDispatch<AppDispatch>();
  const ticks = useTick(store);
  const [resizes, stageRef] = useResize(store);
  const inputs = usePlayer(ticks, store);
  useAlien(ticks);
  useBonus(ticks);
  useBeam(ticks);
  useRule(ticks);

  return { store, dispatch, ticks, resizes, inputs, stageRef };
};
