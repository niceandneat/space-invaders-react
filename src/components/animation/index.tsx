import React, { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import { AnimationOnFinishProvider, useAnimationOnFinish } from './context';

type AnimationManagerProps = {
  children: React.ReactNode;
  repeat?: boolean;
};

export function AnimationManager({
  children,
  repeat = false,
}: AnimationManagerProps) {
  const childrenArray = Array.isArray(children) ? children : [children];
  const maxFrame = childrenArray.length;

  const [frame, setFrame] = useState(0);
  const onFinish = useAnimationOnFinish();

  const onFinishHandler = useCallback(() => {
    setFrame((f) => f + 1);
  }, []);

  useEffect(() => {
    if (frame === maxFrame) {
      onFinish();

      if (repeat) {
        setFrame(0);
      }
    }
  }, [frame, maxFrame, repeat, onFinish]);

  return (
    <AnimationOnFinishProvider value={onFinishHandler}>
      {childrenArray.filter((_, i) => i <= frame)}
    </AnimationOnFinishProvider>
  );
}

type AnimationShowProps = {
  children: React.ReactNode;
  interval: number;
  delay?: number;
  className?: string;
  itemClassName?: string;
  showClassName?: string;
  style?: React.CSSProperties;
  repeat?: boolean;
};

export function AnimationShow({
  children,
  interval,
  delay = 0,
  repeat = false,
  className,
  itemClassName,
  showClassName,
  style,
}: AnimationShowProps) {
  const childrenArray = Array.isArray(children) ? children : [children];
  const maxFrame = childrenArray.length + delay;

  const [finished, setFinished] = useState(false);
  const [frame, setFrame] = useState(0);
  const onFinish = useAnimationOnFinish();

  useEffect(() => {
    let newFrame: number;

    if (frame === maxFrame) {
      if (!finished) {
        onFinish();
        setFinished(true);
      }

      if (!repeat) {
        return;
      }

      newFrame = 0;
    } else {
      newFrame = frame + 1;
    }

    const handle = window.setTimeout(() => setFrame(newFrame), interval);

    return () => window.clearTimeout(handle);
  }, [interval, maxFrame, frame, finished, repeat, onFinish]);

  return (
    <div className={className} style={style}>
      {childrenArray.map((c, i) => (
        <AnimationShowItem
          key={i}
          show={i + delay < frame}
          className={itemClassName}
          showClassName={showClassName}
        >
          {c}
        </AnimationShowItem>
      ))}
    </div>
  );
}

type AnimationShowItemProps = {
  children: React.ReactNode;
  show?: boolean;
  className?: string;
  showClassName?: string;
};

export function AnimationShowItem({
  children,
  show,
  className,
  showClassName = 'show',
}: AnimationShowItemProps) {
  return (
    <span
      className={cn(className, {
        [showClassName]: show,
      })}
    >
      {children}
    </span>
  );
}

type AnimationDelayProps = {
  interval: number;
  delay: number;
};

export function AnimationDelay({ delay, interval }: AnimationDelayProps) {
  const [frame, setFrame] = useState(0);
  const onFinish = useAnimationOnFinish();

  useEffect(() => {
    if (frame === delay) {
      return onFinish();
    }

    const handle = window.setTimeout(() => setFrame((f) => f + 1), interval);

    return () => window.clearTimeout(handle);
  }, [interval, frame, delay, onFinish]);

  return null;
}
