export interface TimelineEvent {
  id: string;
  orgName: string;
  role: string;
  location: string;
  type: "WORK" | "EDUCATION" | "PROJECT";
  startDate: string;
  endDate: string;
  description: string[];
  color: string;
}

export const EXPERIENCE_EVENTS: TimelineEvent[] = [
  {
    id: "njit-research",
    orgName: "New Jersey Institute of Technology",
    role: "Volunteer Research Assistant",
    location: "Newark, NJ",
    type: "WORK",
    startDate: "2026-01",
    endDate: "Present",
    description: [
      "Conducting research in data processing under faculty supervision.",
    ],
    color: "#CC0000", // NJIT Red
  },
  {
    id: "glaston-swe",
    orgName: "Glaston Corporation",
    role: "Software Support Engineer",
    location: "Cherry Hill, NJ (Hybrid)",
    type: "WORK",
    startDate: "2025-12",
    endDate: "2026-02",
    description: [
      "Reduced operational backlog by ~65%, maintaining service speed and contributing to $250k+ in monthly profit.",
      "Implemented and validated a SQL-based purging mechanism in Glaston Embedded Systems, improving machine uptime by 100%.",
      "Built a Smart TV web app using Supabase and Vercel that automated project deadline tracking, replacing manual Excel workflows with a centrally managed carousel display and RBAC for manager access.",
    ],
    color: "#0057A8",
  },
  {
    id: "develop-for-good",
    orgName: "Develop for Good",
    role: "Engineer",
    location: "Remote",
    type: "WORK",
    startDate: "2025-05",
    endDate: "2025-09",
    description: [
      "Built software solutions for nonprofit organizations as part of a volunteer engineering cohort.",
    ],
    color: "#2E7D32",
  },
  {
    id: "stipecent-se",
    orgName: "Stipecent AI",
    role: "Solutions Engineer",
    location: "Remote",
    type: "WORK",
    startDate: "2025-02",
    endDate: "2025-08",
    description: [
      "Built a RAG system using Azure OpenAI and vector databases, processing 5,000+ queries to match users with social assistance programs across Boston, NYC, and SF.",
      "Refactored the founder's Next.js MVP with code splitting and static site generation, improving maintainability and deployment architecture.",
      "Optimized landing page load times by 40% via server-side rendering improvements, measured through Vercel Analytics.",
    ],
    color: "#6C47FF",
  },
];