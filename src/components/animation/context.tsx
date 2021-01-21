import React, { useContext } from 'react';

const AnimationOnFinishContext = React.createContext<() => void>(() => {
  return;
});

type AnimationOnFinishProviderProps = {
  children: React.ReactNode;
  value: () => void;
};

export function AnimationOnFinishProvider({
  children,
  value,
}: AnimationOnFinishProviderProps) {
  return (
    <AnimationOnFinishContext.Provider value={value}>
      {children}
    </AnimationOnFinishContext.Provider>
  );
}

export function useAnimationOnFinish() {
  return useContext(AnimationOnFinishContext);
}
