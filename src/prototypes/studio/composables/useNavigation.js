import { state } from '../state.js'

export function useNavigation() {
  function viewAgent(agent) {
    state.selectAgent(agent)
  }

  function viewTestDetails(result) {
    state.selectTestResult(result)
  }

  function backToTests() {
    state.backToTestsList()
  }

  function backToAgentList() {
    state.currentPage = 'agent-list'
    state.selectedAgent = null
  }

  return {
    viewAgent,
    viewTestDetails,
    backToTests,
    backToAgentList,
  }
}
