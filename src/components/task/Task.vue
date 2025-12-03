<template>
  <li
    @mouseenter="showActions = true"
    @mouseleave="showActions = false"
    :aria-disabled="disabled"
    class="task relative rounded-lg border bg-neutral-100 border-neutral-200 aria-disabled:bg-neutral-100/70 aria-disabled:border-neutral-200/50"
  >
    <span class="font-medium text-xs" :class="disabled ? 'line-through text-neutral-400' : 'text-neutral-800'">
      {{ reminder.title }}
    </span>

    <div>
      <span class="text-[10px]" :class="disabled ? 'text-neutral-400 line-through' : 'text-neutral-800'"> 08:00 </span>

      <span class="text-[10px]" :class="disabled ? 'text-neutral-400' : 'text-neutral-800'"> | </span>

      <span class="text-[10px] text-indigo-600" :class="disabled ? 'text-neutral-400 line-through' : ''"> Joãozinho da Silva </span>
    </div>

    <ButtonGroup v-if="showActions" class="h-6 absolute -right-1 -bottom-1">
      <Button variant="outline" size="icon" class="h-6" @click="deleteTask">
        <Trash2 class="size-4 text-red-500" />
      </Button>
      <Button variant="outline" size="icon" class="h-6" @click="editTask">
        <Pencil class="size-4 text-indigo-500" />
      </Button>
    </ButtonGroup>
  </li>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-vue-next";
import type { Reminder } from "@/types/Reminder";

type Props = {
  reminder: Reminder;
};

type Emits = {
  (e: "delete"): void;
  (e: "edit"): void;
};

defineProps<Props>();
const emit = defineEmits<Emits>();

const showActions = ref<boolean>(false);

function deleteTask() {
  emit("delete");
}

function editTask() {
  emit("edit");
}
</script>

<style scoped>
.task {
  padding: 6px 8px 4px 8px;
  list-style: none;
}
</style>
