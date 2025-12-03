<template>
  <ul class="tasks">
    <Task v-for="i in 3" :key="i" :label="`Tarefa ${i}`" :disabled="i === 1" />
  </ul>
</template>

<script setup lang="ts">
import Task from "./Task.vue";
</script>

<style scoped>
.tasks {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
</style>
