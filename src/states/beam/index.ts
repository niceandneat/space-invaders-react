import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
interface BeamState {
  beams: Beam[];
  newId: number;
  beamDelay: number;
  beamFrequency: number;
}

export interface Beam {
  id: number;
  x: number;
  y: number;
  dy: number;
  width: number;
  height: number;
  type: BeamType;
  shootDelay: number;
}
export type BeamType =
  | 0 // palyer
  | 1 // alien 1
  | 2 // alien 2
  | 3 // alien 3
  | 4 // boom
  | 5 // boom on floor
  | 6; // boom on ceil

export interface BeamAddPayload {
  type: BeamType;
  x: number;
  y: number;
}
export interface BeamStepPayload {
  id: number;
  y: number;
}
export interface BeamRemovePayload {
  id: number;
  type?: BeamType;
}

// initial state
const initialState: BeamState = {
  beams: [],
  newId: 0,
  beamDelay: 800,
  beamFrequency: 800,
};

// sliice
const beamSlice = createSlice({
  name: 'beam',
  initialState,
  reducers: {
    resetBeam(state) {
      state.beams = [];
      state.newId = initialState.newId;
      state.beamDelay = initialState.beamDelay;
      state.beamFrequency = initialState.beamFrequency;
    },
    step(state, { payload }: PayloadAction<BeamStepPayload>) {
      const beam = state.beams.find((b) => b.id === payload.id);
      if (!beam) return;
      beam.y = payload.y;
    },
    addBeam(state, { payload }: PayloadAction<BeamAddPayload>) {
      const newBeam: Beam = {
        id: state.newId,
        ...payload,
        ...getBeamTypeValue(payload.type),
      };
      newBeam.x -= newBeam.width / 2;
      state.newId += 1;
      state.beams.push(newBeam);
    },
    removeBeam(
      state,
      { payload }: PayloadAction<BeamRemovePayload | BeamRemovePayload[]>,
    ) {
      const removes = Array.isArray(payload) ? payload : [payload];

      for (const remove of removes) {
        const index = state.beams.findIndex((b) => b.id === remove.id);
        if (index < 0) continue;
        const beam = state.beams[index];
        if (remove.type) {
          // change type to collision type
          const newSize = getBeamTypeValue(remove.type);
          beam.type = remove.type;
          beam.x += beam.width / 2;
          beam.width = newSize.width;
          beam.height = newSize.height;
          beam.x -= beam.width / 2;
        } else {
          state.beams.splice(index, 1);
        }
      }
    },
    setBeamDelay(state, { payload }: PayloadAction<number>) {
      state.beamDelay = payload;
    },
  },
});

// action creators
export const {
  resetBeam,
  addBeam,
  removeBeam,
  step,
  setBeamDelay,
} = beamSlice.actions;

// reducer
export default beamSlice.reducer;

// selectors
export * as selectBeam from './selector';

// utility functions
function getBeamTypeValue(type: BeamType) {
  if (type === 0) {
    return {
      dy: -100,
      width: 0.5,
      height: 3,
      shootDelay: 300,
    };
  } else if (type < 4) {
    return {
      dy: 50,
      width: 3 * (3 / 7),
      height: 4,
      shootDelay: 300,
    };
  } else if (type < 5) {
    return {
      dy: 0,
      width: 4,
      height: 4,
      shootDelay: 300,
    };
  } else {
    return {
      dy: 0,
      width: 3,
      height: 4,
      shootDelay: 300,
    };
  }
}
