import React from 'react';
import cn from 'classnames';

import buttonFire from 'images/button_fire.png';
import buttonLeft from 'images/button_left.png';
import buttonRight from 'images/button_right.png';

import './style.css';

type ButtonProps = {
  isVertical: boolean;
  className?: string;
  children?: React.ReactNode;
  onPointerDown?: (e: Event) => void;
  onPointerUp?: (e: Event) => void;
};

export function Button({
  children,
  onPointerDown,
  onPointerUp,
  className,
}: ButtonProps) {
  const pointerDownHandler =
    onPointerDown &&
    ((e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown(e.nativeEvent);
    });

  const pointerUpHandler =
    onPointerUp &&
    ((e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerUp(e.nativeEvent);
    });

  return (
    <div className="button__container">
      <button
        className={`button ${className}`}
        type="button"
        onPointerDown={pointerDownHandler}
        onPointerUp={pointerUpHandler}
        onPointerLeave={pointerUpHandler}
      >
        {children}
      </button>
    </div>
  );
}

export function LeftButton(props: Omit<ButtonProps, 'children'>) {
  return (
    <Button {...props}>
      <img
        alt="left"
        className="button__image pixel-perfect"
        draggable={false}
        src={buttonLeft}
      ></img>
    </Button>
  );
}

export function RightButton(props: Omit<ButtonProps, 'children'>) {
  return (
    <Button {...props}>
      <img
        alt="right"
        className="button__image pixel-perfect"
        draggable={false}
        src={buttonRight}
      ></img>
    </Button>
  );
}
export function FireButton(props: Omit<ButtonProps, 'children'>) {
  const { isVertical } = props;

  return (
    <Button
      {...props}
      className={cn({
        ['button--fire-horizontal']: !isVertical,
      })}
    >
      <img
        alt="fire"
        className="button__image pixel-perfect"
        draggable={false}
        src={buttonFire}
      ></img>
    </Button>
  );
}
