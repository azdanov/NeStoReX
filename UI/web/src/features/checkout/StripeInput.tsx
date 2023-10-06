import { InputBaseComponentProps } from "@mui/material";
import { forwardRef, Ref, useImperativeHandle, useRef } from "react";

interface Props extends InputBaseComponentProps {}

export const StripeInput = forwardRef(function StripeInput(
  { component: Component, ...props }: Props,
  ref: Ref<unknown>,
) {
  const elementRef = useRef<HTMLElement>();

  useImperativeHandle(ref, () => ({
    focus: () => elementRef.current?.focus,
  }));

  return (
    <Component
      onReady={(element: HTMLElement) => (elementRef.current = element)}
      {...props}
    />
  );
});
