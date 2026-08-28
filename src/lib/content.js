import { VOCABULARY as A1_VOCABULARY } from "../levels/a1-vocabulary.js";
import { GRAMMAR as A1_GRAMMAR } from "../levels/a1-grammar.js";
import { VOCABULARY as A2_VOCABULARY } from "../levels/a2-vocabulary.js";
import { GRAMMAR as A2_GRAMMAR } from "../levels/a2-grammar.js";
import { VOCABULARY as B1_VOCABULARY } from "../levels/b1-vocabulary.js";
import { GRAMMAR as B1_GRAMMAR } from "../levels/b1-grammar.js";
import { VOCABULARY as B2_VOCABULARY } from "../levels/b2-vocabulary.js";
import { GRAMMAR as B2_GRAMMAR } from "../levels/b2-grammar.js";

// Vocabulary and grammar are level-specific — a level with no entry here simply has no
// "Vocabulary"/"Grammar" link/screen at all.
export const LEVEL_VOCABULARY = { a1: A1_VOCABULARY, a2: A2_VOCABULARY, b1: B1_VOCABULARY, b2: B2_VOCABULARY };
export const LEVEL_GRAMMAR = { a1: A1_GRAMMAR, a2: A2_GRAMMAR, b1: B1_GRAMMAR, b2: B2_GRAMMAR };
