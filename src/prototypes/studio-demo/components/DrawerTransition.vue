<template>
  <Transition name="side-drawer" mode="out-in">
    <slot />
  </Transition>
</template>

<script setup>
// Slide a right-docked drawer in and out. Wrap a drawer that has v-if on it:
//   <DrawerTransition><MyDrawer v-if="open" /></DrawerTransition>
// Tune the slide with the two CSS vars below. They apply to every docked drawer.
</script>

<style>
:root {
  /* Enter: decelerate into place. Exit: quicker, accelerating out. */
  --side-drawer-enter: 280ms cubic-bezier(0.32, 0.72, 0, 1);
  --side-drawer-leave: 200ms cubic-bezier(0.4, 0, 1, 1);
}

.side-drawer-enter-active {
  transition: transform var(--side-drawer-enter);
  will-change: transform;
}

.side-drawer-leave-active {
  transition: transform var(--side-drawer-leave);
  will-change: transform;
}

.side-drawer-enter-from,
.side-drawer-leave-to {
  transform: translateX(100%);
}

/* Reduced motion: a short fade instead of a slide. */
@media (prefers-reduced-motion: reduce) {
  .side-drawer-enter-active,
  .side-drawer-leave-active {
    transition: opacity 150ms linear;
  }

  .side-drawer-enter-from,
  .side-drawer-leave-to {
    transform: none;
    opacity: 0;
  }
}
</style>
