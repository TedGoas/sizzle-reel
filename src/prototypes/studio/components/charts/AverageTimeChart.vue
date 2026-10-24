<template>
  <div class="chart-card chart-card-3" style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px;">
    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
      <span style="font-size: 13px; color: #666;">Average resolution time</span>
      <dt-icon name="info" size="200" class="d-fc-muted" />
    </div>
    <div style="font-size: 32px; font-weight: 600; margin-bottom: 4px;">2m 12s</div>
    <div style="font-size: 12px; color: #999; margin-bottom: 16px;">504 resolved conversations</div>

    <!-- Mini Chart -->
    <svg width="100%" height="100" style="display: block;" viewBox="0 0 280 100">
      <g transform="translate(0, 10)">
        <polyline points="0,50 35,45 70,55 105,40 140,48 175,52 210,45 245,50 280,48" fill="none" stroke="#1976D2" stroke-width="2" />
      </g>
    </svg>

    <div style="display: flex; justify-content: space-between; font-size: 11px; color: #999; margin-top: 4px;">
      <span>12</span>
      <span>13</span>
      <span>14</span>
      <span>15</span>
      <span>16</span>
      <span>17</span>
      <span>18</span>
      <span>19</span>
    </div>

    <div style="display: flex; gap: 16px; margin-top: 8px; font-size: 11px;">
      <div style="display: flex; align-items: center; gap: 4px;">
        <div style="width: 12px; height: 3px; background: #1976D2;"></div>
        <span style="color: #666;">Resolved</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DtIcon } from '../ui'
</script>
