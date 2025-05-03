import { useCallback, useEffect, useState } from "react";

interface IKey {
  key: string;
}

export function useKeyPress(
  targetKey: string,
  handlePress: () => void
): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = useCallback(
    ({ key }: IKey): void => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    },
    [targetKey]
  );

  const upHandler = useCallback(
    ({ key }: IKey): void => {
      if (key === targetKey) {
        setKeyPressed(false);
        handlePress();
      }
    },
    [targetKey, handlePress]
  );

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [downHandler, upHandler]);

  return keyPressed;
}
