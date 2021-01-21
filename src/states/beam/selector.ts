import { AppState } from '../index';
import { ratio } from '../game/selector';
import { Beam } from './index';

export const display = (state: AppState) => {
  const r = ratio(state);

  return state.beam.beams.map((beam) => displayBeam(beam, r));
};

const displayBeam = (beam: Beam, r: number) => {
  return {
    ...beam,
    x: beam.x * r,
    y: beam.y * r,
    width: beam.width * r,
    height: beam.height * r,
  };
};
