<template>
  <Chart type="bar" :data="data" :options="options" />
</template>

<script setup>
import { Chart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
)

defineProps({
  data: { type: Object, required: true },
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { boxWidth: 10, boxHeight: 10, font: { size: 11 }, color: '#3A3A3A' },
    },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    x: { stacked: true, grid: { display: false }, ticks: { color: '#6B6B6B', font: { size: 11 } } },
    y: { stacked: true, grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { color: '#6B6B6B', font: { size: 11 } } },
    y1: {
      position: 'right',
      min: 0,
      max: 100,
      grid: { drawOnChartArea: false },
      ticks: { color: '#6B6B6B', font: { size: 11 }, callback: (value) => `${value}%` },
    },
  },
}
</script>
