import { useState, useEffect, useRef } from 'react';
import { AppStore } from 'states';
import { setScreenSize, setStageSize } from 'states/game';
import { removeElement, debounce } from 'utils';

export type ResizeListener = (store: AppStore) => void;

export const useResize = (
  store: AppStore,
): [ResizeListener[], React.RefObject<HTMLDivElement>] => {
  const [resizeListeners] = useState<ResizeListener[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);

  // set resize listener
  useEffect(() => {
    const screenResize = () => {
      const rect = document.body.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      store.dispatch(setScreenSize([width, height]));
    };
    const stageResize: ResizeListener = (store) => {
      if (stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect();
        const { width, height } = rect;

        store.dispatch(setStageSize([width, height]));
      }
    };
    resizeListeners.push(screenResize);
    resizeListeners.push(stageResize);

    function resize() {
      resizeListeners.forEach((listener) => listener(store));
    }
    const debounceResize = debounce(500, resize);
    window.addEventListener('resize', debounceResize);

    // postpone initial size setting to next microtask
    Promise.resolve().then(resize);

    return () => {
      removeElement(resizeListeners, screenResize);
      removeElement(resizeListeners, stageResize);
      window.removeEventListener('resize', debounceResize);
    };
  }, [resizeListeners, store]);

  return [resizeListeners, stageRef];
};
