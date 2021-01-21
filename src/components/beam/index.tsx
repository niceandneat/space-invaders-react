import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Beam as StateBeam,
  selectBeam,
  removeBeam,
  BeamType,
} from 'states/beam';

import alienBeamOneFirst from 'images/alien_beam_1-1.png';
import alienBeamOneSecond from 'images/alien_beam_1-2.png';
import alienBeamTwoFirst from 'images/alien_beam_2-1.png';
import alienBeamTwoSecond from 'images/alien_beam_2-2.png';
import alienBeamThreeFirst from 'images/alien_beam_3-1.png';
import alienBeamThreeSecond from 'images/alien_beam_3-2.png';
import beamBoomFloor from 'images/beam_boom_floor.png';
import beamBoom from 'images/beam_boom.png';

import './style.css';

const BEAM_BOOM_DELAY = 100;

export function Beams() {
  const beams = useSelector(selectBeam.display);

  return (
    <div className="beam__container">
      {beams.map((beam) => (
        <Beam key={beam.id} {...beam}></Beam>
      ))}
    </div>
  );
}

type BeamProps = StateBeam;

export function Beam({ id, x, y, width, height, type }: BeamProps) {
  const [frame, setFrame] = useState(0);
  const dispatch = useDispatch();

  // beam animation
  useEffect(() => {
    let delay = BEAM_BOOM_DELAY;
    let prevTime = 0;
    let handle: number;

    function beamAnimation(time: number) {
      if (type > 3) {
        delay = BEAM_BOOM_DELAY;
        handle = requestAnimationFrame(boomEffectTimer);
        return;
      }

      handle = requestAnimationFrame(beamAnimation);
      updateDelay(time);

      if (delay === 0) {
        setFrame((f) => (f + 1) % 4);
        delay = BEAM_BOOM_DELAY;
      }
    }

    function boomEffectTimer(time: number) {
      updateDelay(time);

      if (delay === 0) {
        dispatch(removeBeam({ id }));
      } else {
        handle = requestAnimationFrame(boomEffectTimer);
      }
    }

    function updateDelay(time: number) {
      const delta = time - (prevTime || time);
      delay = Math.max(0, delay - delta);
      prevTime = time;
    }

    handle = requestAnimationFrame(beamAnimation);

    return () => cancelAnimationFrame(handle);
  }, [setFrame, dispatch, id, type]);

  const image = getBeamImage(type, frame);

  const containerStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    top: `${y}px`,
    left: `${x}px`,
  };

  const imageStyle = image.transform
    ? { transform: image.transform }
    : undefined;

  return (
    <div className="beam" style={containerStyle}>
      {image.src ? (
        <img
          className="beam__image pixel-perfect"
          alt="beam"
          src={image.src}
          style={imageStyle}
        ></img>
      ) : (
        <div className="beam--player"></div>
      )}
    </div>
  );
}

function getBeamImage(
  type: BeamType,
  frame: number,
): { src: string; transform?: string } {
  if (type === 0) {
    return { src: '' };
  } else if (type === 1) {
    if (frame === 0) {
      return { src: alienBeamOneFirst };
    } else if (frame === 1) {
      return { src: alienBeamOneSecond };
    } else if (frame === 2) {
      return { src: alienBeamOneFirst, transform: 'rotate(0.5turn)' };
    } else {
      return { src: alienBeamOneSecond, transform: 'rotate(0.5turn)' };
    }
  } else if (type === 2) {
    if (frame === 0) {
      return { src: alienBeamTwoFirst };
    } else if (frame === 1) {
      return { src: alienBeamTwoSecond };
    } else if (frame === 2) {
      return { src: alienBeamTwoSecond, transform: 'rotate(0.5turn)' };
    } else {
      return { src: alienBeamTwoFirst, transform: 'rotate(0.5turn)' };
    }
  } else if (type === 3) {
    if (frame === 0) {
      return { src: alienBeamThreeFirst };
    } else if (frame === 1) {
      return { src: alienBeamThreeSecond };
    } else if (frame === 2) {
      return { src: alienBeamThreeFirst, transform: 'rotate(0.5turn)' };
    } else {
      return { src: alienBeamThreeSecond, transform: 'rotate(0.5turn)' };
    }
  } else if (type === 4) {
    return { src: beamBoom };
  } else if (type === 5) {
    return { src: beamBoomFloor };
  } else {
    return { src: beamBoomFloor, transform: 'rotate(0.5turn)' };
  }
}
