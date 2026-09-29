"use server";

export type BriefField = "name" | "email" | "idea";

export type BriefState = {
  status: "idle" | "error" | "success";
  errors?: Partial<Record<BriefField, string>>;
  values?: Record<string, string | string[]>;
};

/**
 * Validates a project brief. This demo doesn't deliver it anywhere yet: connect an
 * email service or CRM (Resend, HubSpot, a Google Sheet) where marked below.
 */
export async function sendBrief(_prev: BriefState, formData: FormData): Promise<BriefState> {
  const get = (key: string) => String(formData.get(key) ?? "").trim();
  const values = {
    name: get("name"),
    company: get("company"),
    email: get("email"),
    whatsapp: get("whatsapp"),
    location: get("location"),
    date: get("date"),
    idea: get("idea"),
    types: formData.getAll("types").map(String),
  };

  const errors: BriefState["errors"] = {};
  if (!values.name) errors.name = "Tell us who we’re talking to.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "We need an email we can reply to.";
  if (values.idea.length < 10) errors.idea = "A line or two about the idea helps us come prepared.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values };
  }

  // Deliver the brief here (email, CRM, sheet). For the demo we only simulate a short send.
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { status: "success" };
}
