import { processQuery } from './assistant.js';
import SYSTEM_PROMPT from './systemPrompt.js';
import personality from './personality.js';
import { buildDriverContext } from './contextBuilder.js';
import { buildPrompt } from './promptBuilder.js';
import { KNOWLEDGE_BASE } from './knowledgeBase.js';
import { AI_TOOLS } from './tools.js';
import { INTENTS } from './intents.js';
import { RULES } from './rules.js';

export {
  processQuery,
  SYSTEM_PROMPT,
  personality,
  buildDriverContext,
  buildPrompt,
  KNOWLEDGE_BASE,
  AI_TOOLS,
  INTENTS,
  RULES
};

export default processQuery;
