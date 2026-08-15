import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'

const prototypes = [
  { name: 'analytics-gpt', label: 'AnalyticsGPT' },
  { name: 'launchpad', label: 'Launchpad' },
  { name: 'ai-chatbot', label: 'AI Chatbot' },
  { name: 'scorecards', label: 'Scorecards' },
  { name: 'scorecards-v1-mvp', label: 'Scorecards V1 - MVP' },
  { name: 'scorecards-v1-ai-questions', label: 'Scorecards V2 - AI Questions' },
  { name: 'scorecards-future', label: 'Scorecards V4 - Future' },
]

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  ...prototypes.map((proto) => ({
    path: `/prototypes/${proto.name}`,
    name: proto.name,
    component: () => import(`./prototypes/${proto.name}/index.vue`),
  })),
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export { prototypes }
export default router
