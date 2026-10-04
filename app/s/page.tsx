import type { Metadata } from "next";
import { ScheduleView } from "@/components/schedule-view";

export const metadata: Metadata = {
  title: "Schedule",
  description: "Live countdown to the end of every period at Mission San Jose High.",
};

export default function SchedulePage() {
  return <ScheduleView />;
}
