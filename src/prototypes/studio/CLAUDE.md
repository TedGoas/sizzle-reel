# Agentic Studio

Visual builder for creating and managing AI agents with skills, workflows, testing, and multi-channel deployment. Navigation is state-driven — no Vue Router.

## Environment

dpadmin (`active-section="ai-agents"`, `current-tab="ai-agent-management"`)

## File Structure

```
agentic-studio/
├── AgenticStudio.vue       # Root: view routing, global toasts, drawers
├── state.js                # Single reactive() export
├── assets/mining-illustration.svg
├── components/
│   ├── SkillMiningBanner.vue
│   ├── ToastNotification.vue
│   ├── canvas/             # CanvasConnections, CanvasNode, CanvasFloatingControls, CanvasZoomControls
│   ├── charts/             # AverageTimeChart, ConcentricCircleChart, DeflectionRateChart,
│   │                       #   ResolutionRateChart, SkillMiningDonutChart, SkillUsageChart
│   ├── drawers/            # CallSourcesPopover, SkillMiningDrawer, SkillOpportunityDrawer
│   ├── modals/             # ChannelCard, ContactCenterConfig, DeploymentModal,
│   │                       #   SkillMiningModal, WebchatConfig
│   ├── overview/history/   # HistoryView, HistoryPagination, filters/ (6 filter components)
│   ├── panels/             # ConnectionBadge, SkillPanel
│   ├── popovers/           # AddSkillPopover, ChannelSelectorPopover, PublishPopover
│   ├── skills/             # MiningResultCard, SkillOpportunityCard, SkillOpportunityDetail,
│   │                       #   WorkflowStepCard
│   ├── tables/             # AgentTable
│   ├── testing/            # TestResultCard, TestResultTimeline, TestResultsTable, TestScenarioCard
│   └── widgets/            # AiCsatWidget, AverageHandleTimeWidget, GuardianAlertsWidget,
│                           #   SkillMiningWidget, TimeseriesMetricsWidget, TotalConversationsWidget
├── composables/
│   ├── useCanvasEditor.js  # Zoom, pan, animated fullscreen transition
│   ├── useNavigation.js    # Thin wrappers around state navigation methods
│   ├── useSkillBuilder.js  # buildSkillFromMining(), buildSkillFromScratch()
│   ├── useTestRunner.js    # runTest(), runAllTests(), resetTests()
│   ├── useTimeseriesChart.js / useTimeseriesData.js  # Analytics chart helpers
│   └── useTypewriter.js    # typewriterEffect(text, callback, speed)
├── config/
│   ├── agentsData.js       # Agent list with per-agent canvasSkills
│   ├── tabsConfig.js       # agentTabs[], channelOptions[], sortOptions[]
│   ├── testResultsData.js  # Seed data — initialized into state.testResultsList
│   ├── workflowData.js     # builderSteps, workflowSteps, logicRules (NOT Proving Ground scenarios)
│   └── mockData.js / skillsData.js / statusColors.js
├── views/
│   ├── AgentDetail.vue     # Tab host + publish/deploy modal wiring
│   ├── AgentList.vue
│   ├── SkillDetailPage.vue # Full-page skill editor (instructions + validation)
│   ├── TestResultDetail.vue
│   ├── WorkflowBuilder.vue / DeployConfirm.vue / ProvingGround.vue / SkillMining.vue
│   └── agent-detail-tabs/  # AgentEditorTab, AnalyticsTab, ConversationHistoryTab,
│                           #   OverviewTab, SettingsTab, SkillsWorkflowsTab, TestingTab
└── styles/                 # agent-detail.css, animations.css, canvas.css, drawer.css, timeline.css
```

## State Contract

No settings panel — `AgenticStudio.meta.js` has empty `prototypeSettings`. All state is internal.

```js
// Navigation
currentPage            // 'agent-list' | 'agent-detail' | 'skill-detail'
currentAgentTab        // 'overview' | 'agent-editor' | 'testing' | 'analytics' |
                       //   'conversation-history' | 'skills-workflows' | 'settings'
setCurrentPage(page)
setCurrentAgentTab(tab)

// Agent — selectAgent() also deep-clones agent.canvasSkills into skillNodes
selectAgent(agent)     // → 'agent-detail', resets tab to 'overview'
selectedAgent          // null on agent-list

// Skill detail
selectedSkillId
navigateToSkillDetail(skillId)  // → 'skill-detail'
backFromSkillDetail()           // → 'agent-detail', tab → 'skills-workflows'

// Test results
selectedTestResult
provingGroundView      // 'list' | 'empty' | 'detail'
latestTestResultId
testResultsList        // seeded from config/testResultsData.js
selectTestResult(result)
backToTestsList()

// Canvas
skillNodes             // Array — persists across tabs; loaded by selectAgent()
hasUnsavedChanges
isFullScreenEditor
activeSkillBuild       // skillId during build animation, null when idle

// Mining
showMiningDrawer / showMiningDetailsModal / showOpportunityDrawer
selectedOpportunity
miningStatus           // null | 'in-progress' | 'complete'
hasMiningResults
createSkillFromMining  // opportunity object; watched by AgentEditorTab
isCreatingSkill

// Testing (Proving Ground) — all persist across tab switches
generatedScenarios
selectedScenarioIds    // Set<id>
selectedTestChannel    // default: 'Select channels'

// Misc
showPublishedToast / showTestCompleteToast
workflowData / currentBuilderStep
```

## Components

**AgenticStudio.vue** — Routes `currentPage` via `viewMap`. Special case: `agent-detail` + `provingGroundView === 'detail'` + `selectedTestResult` → renders `TestResultDetail`. Global drawers/modals mounted here to survive tab switches.

**AgentDetail.vue** — Tab host using `agentTabs` from `tabsConfig.js`. `PublishPopover` and `DeploymentModal` mounted locally, not in root.

**SkillDetailPage.vue** — Three-column layout (260px reserved left column). Skill name auto-sizes via CSS grid trick (`data-value` attr + `::after` mirrors input). Validation cycle: `null → checking → issues → improving → passing`. Actions panel collapses on `validationState` change (via `watch`). Issue details use `DtPopover` (`left-start`).

**AgentEditorTab.vue** — Uses `useCanvasEditor` composable. Watches `state.createSkillFromMining` to trigger skill creation. Fullscreen Test button: `state.setCurrentAgentTab('testing')`.

**DeploymentModal.vue** — channel select → config → publish. Publishing: 1.5s spinner → inline success. Modal title hidden during loading/success. No toast — success is inline only.

**useCanvasEditor.js** — Zoom 0.5–2.0 (step 0.1). Fullscreen uses double `rAF` for start→end rect animation. `canvasPreviewContainer` ref must be bound in `AgentEditorTab`. Exit queries `.agent-detail-container` by class for target rect.

**useSkillBuilder.js** — `buildSkillFromMining()`: pushes node, sets `activeSkillBuild`, writes instructions after 600ms, clears flag. `buildSkillFromScratch()`: pushes empty node, no animation.

**TestingTab.vue** — Generates 4–10 scenarios into `state.generatedScenarios`. Channel validation required before running tests. Status colors: Green #DBFFA9 (86–100%), Orange #FFBD48 (66–85%), Red #FFABA4 (<65%).

## Patterns & Gotchas

- **Adding a top-level page**: create view → add to `viewMap` in `AgenticStudio.vue` → navigate with `state.setCurrentPage()`
- **`selectAgent()` deep-clones** canvas skills — never push directly to `agent.canvasSkills`
- **`testResultsList` resets on refresh** — seeded from config, new results prepended during session
- **`useCanvasEditor` is local** — has its own `isFullScreenEditor` ref separate from `state.isFullScreenEditor`; check which is read when debugging fullscreen
- **Slash command menu** in `SkillDetailPage` — `/` opens palette, Escape closes; Transfer actions snapshot `savedRange` before secondary picker opens, restore on insertion
- **`workflowData.js` testScenarios** are static seeds for `WorkflowBuilder`; Proving Ground generates its own into `state.generatedScenarios`
