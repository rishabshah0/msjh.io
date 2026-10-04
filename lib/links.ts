export interface LinkItem {
  label: string;
  href: string;
  internal?: boolean;
  tag?: string;
  signup?: string;
}

export const general: LinkItem[] = [
  { label: "Countdown schedule", href: "/s", internal: true },
  { label: "Campus map", href: "/map", internal: true },
  { label: "School homepage", href: "/school" },
  { label: "Bell schedule", href: "/bell" },
  { label: "Student Aeries", href: "/aeries" },
  { label: "Important dates", href: "/dates" },
  { label: "MSJ Instagram", href: "/warriors" },
];

export const activities: LinkItem[] = [
  { label: "ASB", href: "/asb", tag: "Website" },
  { label: "Academic Club", href: "/ac", tag: "Discord" },
  { label: "CS Club", href: "/cs", tag: "Website", signup: "/cs/signup" },
  { label: "Biology Club", href: "/bio", tag: "Discord" },
  { label: "AI Club", href: "/ai", tag: "Discord" },
  { label: "Math Club", href: "/math", tag: "Discord" },
  { label: "E-Sports Club", href: "/esports", tag: "Discord" },
  { label: "Japan Club", href: "/jp", tag: "Discord", signup: "/jp/signup" },
];
