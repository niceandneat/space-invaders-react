import React from 'react';
import { useSelector } from 'react-redux';
import { selectGame } from 'states/game';
import { AnimationManager, AnimationShow } from 'components/animation';

import './style.css';

const frameInterval = 100;

export function Message() {
  const message = useSelector(selectGame.message);

  if (!message) return null;

  const messageLetters = message.split('');

  return (
    <div className="message__container">
      <AnimationManager>
        <AnimationShow
          className="message__line"
          showClassName="message__item--show"
          interval={frameInterval}
        >
          {messageLetters}
        </AnimationShow>
      </AnimationManager>
    </div>
  );
}
