<template>
  <div class="chart-card chart-card-2" style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px;">
    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
      <span style="font-size: 13px; color: #666;">Resolution rate</span>
      <dt-icon name="info" size="200" class="d-fc-muted" />
    </div>
    <div style="font-size: 32px; font-weight: 600; margin-bottom: 4px;">56%</div>
    <div style="font-size: 12px; color: #999; margin-bottom: 16px;">900 conversations (504 resolved, 396 unresolved)</div>

    <!-- Mini Chart -->
    <svg width="100%" height="100" style="display: block;" viewBox="0 0 280 100">
      <g transform="translate(0, 10)">
        <!-- Day 12 -->
        <rect x="10" y="30" width="20" height="40" fill="#BBDEFB" />
        <rect x="10" y="15" width="20" height="15" fill="#64B5F6" />
        <!-- Day 13 -->
        <rect x="45" y="35" width="20" height="35" fill="#BBDEFB" />
        <rect x="45" y="20" width="20" height="15" fill="#64B5F6" />
        <!-- Day 14 -->
        <rect x="80" y="20" width="20" height="50" fill="#BBDEFB" />
        <rect x="80" y="5" width="20" height="15" fill="#64B5F6" />
        <!-- Day 15 -->
        <rect x="115" y="10" width="20" height="60" fill="#BBDEFB" />
        <rect x="115" y="0" width="20" height="10" fill="#64B5F6" />
        <!-- Day 16 -->
        <rect x="150" y="25" width="20" height="45" fill="#BBDEFB" />
        <rect x="150" y="10" width="20" height="15" fill="#64B5F6" />
        <!-- Day 17 -->
        <rect x="185" y="30" width="20" height="40" fill="#BBDEFB" />
        <rect x="185" y="15" width="20" height="15" fill="#64B5F6" />
        <!-- Day 18 -->
        <rect x="220" y="30" width="20" height="40" fill="#BBDEFB" />
        <rect x="220" y="15" width="20" height="15" fill="#64B5F6" />
        <!-- Day 19 -->
        <rect x="255" y="35" width="20" height="35" fill="#BBDEFB" />
        <rect x="255" y="20" width="20" height="15" fill="#64B5F6" />
        <!-- Line overlay -->
        <polyline points="20,25 55,30 90,15 125,10 160,20 195,25 230,25 265,30" fill="none" stroke="#1976D2" stroke-width="2" />
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
        <span style="color: #666;">Resolution rate</span>
      </div>
      <div style="display: flex; align-items: center; gap: 4px;">
        <div style="width: 12px; height: 3px; background: #64B5F6;"></div>
        <span style="color: #666;">Resolved</span>
      </div>
      <div style="display: flex; align-items: center; gap: 4px;">
        <div style="width: 12px; height: 3px; background: #BBDEFB;"></div>
        <span style="color: #666;">Unresolved</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DtIcon } from '../ui'
</script>
