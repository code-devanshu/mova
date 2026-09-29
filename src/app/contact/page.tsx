import type { Metadata } from "next";
import { contact } from "@/lib/content";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactIntro } from "@/components/contact/ContactIntro";

export const metadata: Metadata = {
  title: "Start a project",
  description: "Tell MOVA what you're thinking. We read every brief. Promise.",
};

export default async function ContactPage(props: PageProps<"/contact">) {
  const { type } = await props.searchParams;
  const valid = contact.types.map((t) => t.value) as string[];
  const preselected = typeof type === "string" && valid.includes(type) ? [type] : [];

  return (
    <div className="px-5 pb-28 pt-32 md:px-10 md:pb-40 md:pt-40">
      <div className="mx-auto grid max-w-[1680px] gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <ContactIntro />
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <ContactForm preselected={preselected} />
        </div>
      </div>
    </div>
  );
}
