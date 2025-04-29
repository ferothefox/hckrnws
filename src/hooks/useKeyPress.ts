import { useCallback, useEffect, useState } from "react";

interface IKey {
  key: string;
}

export function useKeyPress(
  targetKey: string,
  handlePress: () => void
): boolean {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  const downHandler = useCallback(
    ({ key }: IKey): void => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    },
    [targetKey]
  );

  // If released key is our target key then set to false
  const upHandler = useCallback(
    ({ key }: IKey): void => {
      if (key === targetKey) {
        setKeyPressed(false);
        handlePress();
      }
    },
    [targetKey, handlePress]
  );

  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [downHandler, upHandler]); // Now only depends on the memoized handlers

  return keyPressed;
}
