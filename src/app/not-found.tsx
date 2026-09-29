import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center px-5 py-32 md:px-10">
      <span aria-hidden className="corners absolute inset-3 text-fg/50 md:inset-4" style={{ "--c": "28px" } as React.CSSProperties}>
        <i />
        <i />
        <i />
        <i />
      </span>
      <div className="mx-auto w-full max-w-[1680px]">
        <p className="type-label flex items-center gap-2 text-fg/80">
          <span className="rec-dot" aria-hidden /> No signal
        </p>
        <h1 className="type-display mt-6 text-[clamp(4rem,14vw,15rem)] text-fg">Lost the frame.</h1>
        <p className="mt-6 max-w-[34ch] text-2xl font-medium text-mute">This page didn’t make the final cut.</p>
        <div className="mt-10">
          <Button href="/">Back to home</Button>
        </div>
      </div>
    </section>
  );
}
