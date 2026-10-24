import { state } from '../state.js'

/**
 * Generates rich HTML instructions from a mining opportunity.
 * Each step becomes a formatted paragraph with its name bolded.
 */
function buildInstructionsFromOpportunity(opportunity) {
	const intro = `<p>${opportunity.description}</p>`
	const steps = opportunity.steps
		.map(step => `<p><strong>${step}</strong> — Review and complete this step as needed.</p>`)
		.join('\n')
	return `${intro}\n${steps}`
}

export function useSkillBuilder() {
	/**
	 * Creates a skill node from a mining opportunity and asynchronously
	 * populates its instructions, signalling via state.activeSkillBuild.
	 */
	function buildSkillFromMining(opportunity) {
		const skillId = `skill-${Date.now()}`
		const newSkill = {
			id: skillId,
			name: opportunity.name,
			description: opportunity.description,
			position: { left: 420, top: 50 + state.skillNodes.length * 180 },
			isNew: true,
			fromMining: true,
			instructions: '',
			actionCount: 0,
			status: 'Draft',
			usageCount: null,
			passRate: null,
			hasMiningOpportunity: false,
			miningOpportunityName: null,
			workflows: [],
		}

		state.skillNodes.push(newSkill)
		state.activeSkillBuild = skillId
		state.hasUnsavedChanges = true

		// Simulate async content generation — writes instructions after a brief
		// delay so the panel can display a "building" state before content appears.
		setTimeout(() => {
			const idx = state.skillNodes.findIndex(s => s.id === skillId)
			if (idx !== -1) {
				state.skillNodes[idx].instructions = buildInstructionsFromOpportunity(opportunity)
			}
			state.activeSkillBuild = null
		}, 600)

		return skillId
	}

	/**
	 * Creates a blank skill node (no content, ready for manual authoring).
	 */
	function buildSkillFromScratch() {
		const skillId = `skill-${Date.now()}`
		const newSkill = {
			id: skillId,
			name: '',
			description: '',
			position: { left: 420, top: 50 + state.skillNodes.length * 180 },
			isNew: true,
			fromMining: false,
			instructions: '',
			actionCount: 0,
			status: 'Draft',
			usageCount: null,
			passRate: null,
			hasMiningOpportunity: false,
			miningOpportunityName: null,
			workflows: [],
		}

		state.skillNodes.push(newSkill)
		state.hasUnsavedChanges = true

		return skillId
	}

	return { buildSkillFromMining, buildSkillFromScratch }
}
