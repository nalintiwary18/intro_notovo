export type BlogUpdate = {
  id: string;
  type: "Upcoming Update" | "Updated Info" | "Release Notes" | "Patch Update" | "Interface Update" | "Core Update" | "Optimization Update";
  title: string;
  date: string;
  description: string;
  version?: string;
};

export const blogUpdates: BlogUpdate[] = [
  {
    id: "update-008",
    type: "Optimization Update",
    title: "Generation Constraints & AI Tuning",
    version: "v0.6.1-beta",
    date: "May 10, 2026",
    description: "Implemented weekly AI edit limits for free-tier users. Added upload constraints for oversized documents to improve parser reliability and processing consistency. Optimized Thinking Mode execution pipeline for more efficient generation behavior and reduced computational overhead."
  },
  {
    id: "update-007",
    type: "Core Update",
    title: "Thinking Mode",
    version: "v0.6.0-beta",
    date: "April 28, 2026",
    description: "Introduced Thinking Mode for deeper multi-step reasoning and significantly more detailed AI generation. Added weekly token allocation limits for free-tier accounts with per-user tracking and usage enforcement."
  },
  {
    id: "update-006",
    type: "Interface Update",
    title: "Visual Identity Refresh",
    version: "v0.5.4-beta",
    date: "April 14, 2026",
    description: "Updated the platform identity system with a redesigned logo and refined chatbot interface across desktop and mobile environments. Improved spacing logic, interaction clarity, and conversational layout responsiveness."
  },
  {
    id: "update-005",
    type: "Patch Update",
    title: "Light Mode & Export Optimization",
    version: "v0.5.3-beta",
    date: "April 2, 2026",
    description: "Added a lightweight grayscale light mode optimized for long-form reading and PDF exports. Improved document export consistency and reduced visual artifacts during generation. Includes minor stability and interaction fixes."
  },
  {
    id: "update-004",
    type: "Patch Update",
    title: "Mobile Interface Refinement",
    version: "v0.5.2-beta",
    date: "March 22, 2026",
    description: "Redesigned the mobile interface architecture for smaller devices. Improved viewport handling, touch interactions, and split-layout responsiveness. Resolved multiple rendering inconsistencies and unnecessary re-render cycles affecting editor performance."
  },
  {
    id: "update-003",
    type: "Release Notes",
    title: "Stability & Session Infrastructure",
    version: "v0.5.1-beta",
    date: "March 10, 2026",
    description: "Introduced authenticated sessions, persistent chat history, document versioning, and intent-aware AI routing. Refactored rendering architecture to reduce unintended document mutations and improve update stability across desktop and mobile environments."
  }

];
