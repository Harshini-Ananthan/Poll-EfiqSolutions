import { redirect } from "next/navigation";

export default function SettingsIndexPage() {
  // Automatically redirect to the first sub-page of settings
  redirect("/settings/company-profile");
}
