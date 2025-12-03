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
      <span class="text-[10px]" :class="disabled ? 'text-neutral-400 line-through' : 'text-neutral-800'"> {{ time }} </span>

      <span v-if="entity" class="text-[10px]" :class="disabled ? 'text-neutral-400' : 'text-neutral-800'"> | </span>

      <span v-if="entity" class="text-[10px] text-indigo-600" :class="disabled ? 'text-neutral-400 line-through' : ''"> {{ entity }} </span>
    </div>

    <ButtonGroup v-if="showActions" class="h-6 absolute -right-1 -bottom-1">
      <Button variant="outline" size="icon" class="h-6" @click="emit('delete', props.reminder.id)">
        <Trash2 class="size-4 text-red-500" />
      </Button>
      <Button variant="outline" size="icon" class="h-6" @click="emit('edit', props.reminder)">
        <Pencil class="size-4 text-indigo-500" />
      </Button>
    </ButtonGroup>
  </li>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-vue-next";
import type { ReminderPayload } from "@/types/Reminder";

type Props = {
  reminder: ReminderPayload;
};

type Emits = {
  (e: "delete", id: number): void;
  (e: "edit", reminder: ReminderPayload): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showActions = ref<boolean>(false);

const time = computed(() => {
  return new Date(props.reminder.scheduled_at).toLocaleString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
});

const entity = computed(() => {
  if (!props.reminder.entity_data) return undefined;

  return props.reminder.entity_data?.name || "ChatID " + props.reminder.entityData.id;
});
</script>

<style scoped>
.task {
  padding: 6px 8px 4px 8px;
  list-style: none;
}
</style>
