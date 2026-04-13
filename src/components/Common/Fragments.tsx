import type { PropsWithChildren } from "react";

export function CenteredText({ children }: PropsWithChildren) {
  return (
    <p className="text-primary text-center font-sans text-base font-normal">
      {children}
    </p>
  );
}
