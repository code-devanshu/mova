import type { Metadata } from "next";
import { WorkIndex } from "@/components/work/WorkIndex";

export const metadata: Metadata = {
  title: "Work",
  description: "Creator, brand, music, product, event, corporate and drone work by MOVA. No long explanations. Just the frames.",
};

export default async function WorkPage(props: PageProps<"/work">) {
  const { category } = await props.searchParams;
  return <WorkIndex initialCategory={typeof category === "string" ? category : "all"} />;
}
