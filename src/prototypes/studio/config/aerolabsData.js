/**
 * Aerolabs — company source of truth for the agentic-studio prototype.
 *
 * Used in two places:
 *   1. state.js — pre-fills companyName / companyDesc in every new agent's metadata
 *      so AgentPanel always opens with Aerolabs context ready
 *   2. AgentCreation.vue — injected into Claude's system prompt so AI-generated
 *      agents, skills, and personas are grounded in Aerolabs' business context
 */

export const AEROLABS = {
  /** Displayed in the "Company name" field of AgentPanel (max 50 chars) */
  name: 'Aerolabs',

  /**
   * HTML string for the "Describe your company" rich-text field.
   * Matches the output-format="html" setting on DtRecipeMessageInput.
   */
  companyDesc:
    '<p>Aerolabs is a logistics company redefining sustainable shipping through clean energy and innovation. We offer alternative-fuel air freight, green ground transportation, and eco-friendly supply chain solutions — with a secondary vertical in commercial insurance.</p>',

  /**
   * Compact context block injected into Claude system prompts.
   * Gives the model the brand rules, business context, and named personas
   * so generated agents feel realistic and Aerolabs-specific.
   */
  systemContext: `
COMPANY CONTEXT — Aerolabs
Company: Aerolabs (never "Aero Labs")
Industry: Sustainable logistics (primary) | Commercial insurance (secondary)
Mission: Redefine shipping through clean energy — alternative-fuel air freight, green ground transport, eco-friendly supply chain optimization.
Brand rule: Never mention waste management. Aerolabs does not operate in that space.

Key team members (use these names in generated content):
- CEO: Maria Reyes | COO: Richard Taylor | CTO: Sarah Johnson | CFO: Mark Anderson | CMO: Emily Robertson
- VP of Sales: Mila Bell | Sales Manager: Rod Magers
- Account Executives: Jessica Smith, Brendan Wells, Steve Spencer, Sean Sandys
- Sales Development: Elena Moreno, Jordan Lee, Chris Patel, Sofia Chang, Miles Thompson
- Customer Service Manager: Sarah Johnson | CS Reps: Michael Lee, Emily Brown
- CS Specialists: Nora Kim, Alex Johnson, Rebecca Wallace | Account Managers: Amanda Taylor, Ashanti Trevor
- Logistics: Mark Thompson (Head), Lisa Chen (Coordinator), John Smith (Driver)
- Recruiting: Hannah Collins (Manager), Jacob Reed (Senior Recruiter)

Support tiers: Tier 1 / Tier 2 / Tier 3 | Regional: East Coast, West Coast, International
`.trim(),
}
