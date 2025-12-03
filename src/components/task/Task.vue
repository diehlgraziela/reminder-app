<template>
  <li :aria-disabled="disabled" class="task rounded-lg border bg-neutral-100 border-neutral-200 aria-disabled:bg-neutral-100/70 aria-disabled:border-neutral-200/50">
    <span class="font-medium text-xs" :class="disabled ? 'line-through text-neutral-400' : 'text-neutral-800'">
      {{ label }}
    </span>

    <div>
      <span class="text-[10px]" :class="disabled ? 'text-neutral-400 line-through' : 'text-neutral-800'"> 08:00 </span>

      <span class="text-[10px]" :class="disabled ? 'text-neutral-400' : 'text-neutral-800'"> | </span>

      <span class="text-[10px] text-indigo-600" :class="disabled ? 'text-neutral-400 line-through' : ''"> Joãozinho da Silva </span>
    </div>
  </li>
</template>

<script setup lang="ts">
type Props = {
  label: string;
  disabled?: boolean;
};

defineProps<Props>();
</script>

<style scoped>
.task {
  padding: 6px 8px 4px 8px;
  list-style: none;
}
</style>
