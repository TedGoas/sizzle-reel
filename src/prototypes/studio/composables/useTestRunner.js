import { computed } from 'vue'

export function useTestRunner(testScenarios) {
  const allTestsCompleted = computed(() => {
    return testScenarios.value.every(s => s.status === 'passed')
  })

  async function runTest(scenario) {
    scenario.status = 'running'
    await new Promise(resolve => setTimeout(resolve, 2500))
    scenario.status = 'passed'
  }

  async function runAllTests() {
    for (const scenario of testScenarios.value) {
      if (scenario.status === 'not-started') {
        await runTest(scenario)
      }
    }
  }

  function resetTests() {
    testScenarios.value.forEach(s => s.status = 'not-started')
  }

  return {
    allTestsCompleted,
    runTest,
    runAllTests,
    resetTests
  }
}
