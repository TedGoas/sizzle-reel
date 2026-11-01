<script>
import { STATUS_COLORS } from '../../config/statusColors.js'

export default {
  name: 'ConcentricCircleChart',
  props: {
    percentage: {
      type: Number,
      required: true,
      validator: (value) => value >= 0 && value <= 100
    },
    size: {
      type: Number,
      default: 64
    },
    delay: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: null
    }
  },
  computed: {
    circleColor() {
      // Use passed color if provided
      if (this.color) return this.color;

      // Otherwise use computed color based on percentage
      if (this.percentage < 65) return STATUS_COLORS.failed;
      if (this.percentage <= 85) return STATUS_COLORS.passed;
      return STATUS_COLORS.excellent;
    },
    innerRadius() {
      return this.size * 0.08;
    },
    outerRadius() {
      return this.size * 0.48;
    },
    dynamicRadius() {
      const minRadius = this.innerRadius;
      const maxRadius = this.outerRadius;
      return minRadius + (maxRadius - minRadius) * (this.percentage / 100);
    },
    staticRings() {
      const ring1 = this.size * 0.16;
      const ring2 = this.size * 0.26;
      const ring3 = this.size * 0.36;
      return [ring1, ring2, ring3];
    }
  }
};
</script>

<template>
  <div class="concentric-circle-chart" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <g :transform="`translate(${size / 2}, ${size / 2})`">
        <circle
          :r="dynamicRadius"
          :fill="circleColor"
          class="dynamic-circle"
          :style="{ animationDelay: delay + 'ms' }"
        />
        
        <circle
          v-for="(radius, index) in staticRings"
          :key="`ring-${index}`"
          :r="radius"
          class="static-ring"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.concentric-circle-chart {
  flex-shrink: 0;
}

.static-ring {
  fill: none;
  stroke: var(--dt-color-border-subtle);
  stroke-width: 1;
}

.dynamic-circle {
  opacity: 0;
  transition: r 0.8s cubic-bezier(0.4, 0, 0.2, 1), fill 0.6s ease;
  animation: circle-grow 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes circle-grow {
  from {
    r: 0;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
