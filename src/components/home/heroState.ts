/**
 * Values the DOM writes and the WebGL scene reads every frame.
 * A plain mutable object so scrolling and pointer moves never re-render React.
 */
export const heroState = {
  /** 0 when the hero is fully in view, 1 once it has scrolled away. */
  progress: 0,
  /** Scroll velocity in px/s, decays back to 0 inside the render loop. */
  velocity: 0,
  /** Pointer position, -1..1 on both axes. */
  pointerX: 0,
  pointerY: 0,
};
