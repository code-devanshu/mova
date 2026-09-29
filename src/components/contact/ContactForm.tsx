"use client";

import { useActionState, useEffect, useRef } from "react";
import { ArrowRight, Check } from "@phosphor-icons/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { contact } from "@/lib/content";
import { sendBrief, type BriefState } from "@/app/contact/actions";
import { Button } from "@/components/ui/Button";

const initial: BriefState = { status: "idle" };

const inputClass =
  "w-full border-0 border-b border-line-strong bg-transparent px-0 py-3 text-xl text-fg transition-colors placeholder:text-mute focus:border-fg focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-rec";

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-label text-fg/80">
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-sm text-mute">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-rec-fg">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm({ preselected }: { preselected: string[] }) {
  const [state, action, pending] = useActionState(sendBrief, initial);
  const form = useRef<HTMLFormElement>(null);
  const done = useRef<HTMLDivElement>(null);
  const v = state.values ?? {};
  const val = (k: string) => (typeof v[k] === "string" ? (v[k] as string) : undefined);
  const selected = Array.isArray(v.types) ? (v.types as string[]) : preselected;
  const err = state.errors ?? {};

  // Move focus to the first problem, or to the confirmation.
  useEffect(() => {
    if (state.status === "error") {
      form.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
    }
    if (state.status === "success" && done.current) {
      done.current.focus();
      if (!prefersReducedMotion()) {
        gsap.from(done.current.querySelectorAll("[data-done]"), { y: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08 });
        gsap.from(done.current.querySelectorAll(".corners i"), { scale: 2.2, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.05 });
      }
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={done} tabIndex={-1} className="relative p-8 outline-none md:p-12" role="status">
        <span className="corners absolute inset-0 text-fg" style={{ "--c": "26px" } as React.CSSProperties}>
          <i />
          <i />
          <i />
          <i />
        </span>
        <p data-done className="flex size-10 items-center justify-center bg-rec text-ink">
          <Check weight="bold" size={20} aria-hidden />
        </p>
        <p data-done className="type-display mt-6 text-[clamp(3rem,6vw,6rem)] text-fg">
          Brief received.
        </p>
        <p data-done className="mt-6 max-w-[40ch] text-xl text-mute">
          {contact.promise} We’ll get back to you soon.
        </p>
        <div data-done className="mt-10">
          <Button href="/work" variant="ghost">
            See the work
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form ref={form} action={action} noValidate className="flex flex-col gap-10" aria-describedby="brief-note">
      <div className="grid gap-10 sm:grid-cols-2">
        <Field id="name" label="Your name" error={err.name}>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            defaultValue={val("name")}
            aria-invalid={Boolean(err.name)}
            aria-describedby={err.name ? "name-error" : undefined}
            className={inputClass}
          />
        </Field>
        <Field id="company" label="Brand / Company">
          <input id="company" name="company" autoComplete="organization" defaultValue={val("company")} className={inputClass} />
        </Field>
        <Field id="email" label="Email" error={err.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={val("email")}
            aria-invalid={Boolean(err.email)}
            aria-describedby={err.email ? "email-error" : undefined}
            className={inputClass}
          />
        </Field>
        <Field id="whatsapp" label="WhatsApp" hint="Optional. Easiest way to reach you fast.">
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            defaultValue={val("whatsapp")}
            aria-describedby="whatsapp-hint"
            className={inputClass}
          />
        </Field>
      </div>

      <fieldset>
        <legend className="type-display text-3xl text-fg wdth-100">What are we working on?</legend>
        <div className="mt-5 flex flex-wrap gap-2">
          {contact.types.map((t) => (
            <label key={t.value} className="group relative cursor-pointer">
              <input
                type="checkbox"
                name="types"
                value={t.value}
                defaultChecked={selected.includes(t.value)}
                className="peer sr-only"
              />
              <span className="flex h-11 items-center gap-2 border border-line-strong px-4 text-sm font-semibold uppercase tracking-[0.06em] text-fg/85 transition-colors hover:border-fg peer-checked:border-rec peer-checked:bg-rec peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rec">
                {t.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-10 sm:grid-cols-2">
        <Field id="location" label="Project location">
          <input id="location" name="location" list="location-options" defaultValue={val("location")} className={inputClass} />
          <datalist id="location-options">
            {["Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad", "Chandigarh", "Mohali", "Panchkula"].map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field id="date" label="Preferred date">
          <input id="date" name="date" type="date" defaultValue={val("date")} className={inputClass} />
        </Field>
      </div>

      <Field id="idea" label="Tell us a little about the idea" error={err.idea}>
        <textarea
          id="idea"
          name="idea"
          rows={5}
          required
          defaultValue={val("idea")}
          aria-invalid={Boolean(err.idea)}
          aria-describedby={err.idea ? "idea-error" : undefined}
          className={`${inputClass} resize-y`}
        />
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
        <p id="brief-note" className="text-mute">
          {contact.promise}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group relative inline-flex h-16 items-center gap-4 bg-fg px-8 text-[0.9rem] font-semibold uppercase tracking-[0.06em] text-canvas transition-colors hover:bg-rec hover:text-ink active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Sending" : contact.submit}
          <ArrowRight weight="bold" className={`transition-transform duration-500 ${pending ? "animate-pulse" : "group-hover:translate-x-1.5"}`} />
        </button>
      </div>
    </form>
  );
}
