import * as a1 from "./a1.js";
import * as a2 from "./a2.js";
import * as b1 from "./b1.js";
import * as b2 from "./b2.js";

export const LEVELS = [
  { id: "a1", label: "A1", name: "Beginner", description: "Basic words, 'to be', simple present, everyday vocabulary.", ...a1 },
  { id: "a2", label: "A2", name: "Elementary", description: "Past simple, present continuous, comparatives, modals.", ...a2 },
  { id: "b1", label: "B1", name: "Intermediate", description: "Present perfect, conditionals, passive voice, phrasal verbs.", ...b1 },
  { id: "b2", label: "B2", name: "Upper-Intermediate", description: "Second/third conditionals, deduction modals, collocations.", ...b2 },
];

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id);
}
