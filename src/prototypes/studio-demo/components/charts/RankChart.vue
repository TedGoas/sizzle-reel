<template>
  <Bar :data="data" :options="options" />
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

const props = defineProps({
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
  color: { type: String, default: '#7C52FF' },
  suffix: { type: String, default: '' },
})

const data = computed(() => ({
  labels: props.labels,
  datasets: [{
    data: props.values,
    backgroundColor: props.color,
    borderRadius: 4,
    barThickness: 14,
  }],
}))

const options = computed(() => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (item) => `${item.raw}${props.suffix}`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(0,0,0,0.06)' },
      ticks: { color: '#6B6B6B', font: { size: 11 }, callback: (value) => `${value}${props.suffix}` },
    },
    y: { grid: { display: false }, ticks: { color: '#1A1A1A', font: { size: 12 } } },
  },
}))
</script>
