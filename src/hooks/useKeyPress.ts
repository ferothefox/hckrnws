"use client";

import { useEffect, useEffectEvent } from "react";

function isEditableElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)
  );
}

export function useKeyPress(targetKey: string, onPress: () => void) {
  const handlePress = useEffectEvent(onPress);

  useEffect(() => {
    const normalizedTargetKey = targetKey.toLowerCase();

    const onKeyUp = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isEditableElement(event.target)
      ) {
        return;
      }

      if (event.key.toLowerCase() !== normalizedTargetKey) {
        return;
      }

      event.preventDefault();
      handlePress();
    };

    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [targetKey]);
}
