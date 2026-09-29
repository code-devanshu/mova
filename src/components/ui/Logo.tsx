/** Placeholder wordmark until MOVA's logo is final: the name plus a REC light. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`type-display inline-flex items-start gap-[0.12em] leading-none wdth-100 ${className}`}>
      MOVA
      <span aria-hidden className="mt-[0.08em] block size-[0.26em] rounded-full bg-rec" />
    </span>
  );
}
