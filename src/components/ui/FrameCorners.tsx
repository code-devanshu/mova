type Props = {
  className?: string;
  /** Corners start outside the element and snap in when the parent `.group` is hovered. */
  lock?: boolean;
  size?: number;
};

/** Viewfinder corner brackets. The parent needs `position: relative`. */
export function FrameCorners({ className = "", lock = false, size }: Props) {
  return (
    <span
      aria-hidden
      className={`corners pointer-events-none absolute ${lock ? "corners-lock" : ""} ${className}`}
      style={size ? ({ "--c": `${size}px` } as React.CSSProperties) : undefined}
    >
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}
