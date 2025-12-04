<template>
  <ul class="flex flex-col gap-1.5 flex-1 overflow-y-auto overflow-x-hidden px-3">
    <template v-if="isCustomFilter">
      <Accordion type="multiple" class="w-full">
        <AccordionItem v-for="(reminders, date) in groupedReminders" :key="date" :value="date">
          <AccordionTrigger> {{ formatDate(date) }} </AccordionTrigger>
          <AccordionContent>
            <div class="flex flex-col gap-1.5">
              <ReminderItem v-for="reminder in reminders" :key="reminder.id" :reminder="reminder" @edit="editTask" @delete="deleteTask" />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <p v-if="Object.keys(groupedReminders).length === 0" class="text-sm text-center text-neutral-700">Nenhum lembrete encontrado.</p>
    </template>
    <template v-else>
      <template v-if="filteredReminders.length > 0">
        <ReminderItem v-for="reminder in filteredReminders" :key="reminder.id" :reminder="reminder" @edit="editTask" @delete="deleteTask" />
      </template>
      <p class="text-sm text-center text-neutral-700" v-else>Nenhum lembrete encontrado.</p>
    </template>
  </ul>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ReminderItem from "../reminder/ReminderItem.vue";
import type { ReminderFilter, ReminderPayload } from "@/types/Reminder";
import { useReminderStore } from "@/store/reminderStore";

type Emits = {
  (e: "edit"): void;
};

type Props = {
  selectedDay: ReminderFilter;
};

const emit = defineEmits<Emits>();
const props = defineProps<Props>();
const reminderStore = useReminderStore();

const isCustomFilter = computed(() => {
  return props.selectedDay?.to && props.selectedDay?.from;
});

const groupedReminders = computed(() => {
  if (!isCustomFilter.value) return {};

  const reminders = reminderStore.getReminders();

  if (!reminders || typeof reminders !== "object" || Array.isArray(reminders)) {
    return {};
  }

  const fromDate = props.selectedDay.from?.split(" ")[0];
  const toDate = props.selectedDay.to?.split(" ")[0];

  const filtered: Record<string, ReminderPayload[]> = {};

  for (const date in reminders) {
    if (date >= fromDate! && date <= toDate!) {
      filtered[date] = reminders[date];
    }
  }

  return filtered;
});

const filteredReminders = computed(() => {
  if (isCustomFilter.value) return [];

  const reminders = reminderStore.getReminders();

  if (!props.selectedDay?.date) {
    return [];
  }

  const selectedDate = props.selectedDay.date.split(" ")[0];

  if (reminders && typeof reminders === "object" && !Array.isArray(reminders)) {
    return reminders[selectedDate] || [];
  }

  if (Array.isArray(reminders)) {
    return reminders.filter((reminder) => {
      const reminderDate = reminder.scheduled_at.split("T")[0];
      return reminderDate === selectedDate;
    });
  }

  return [];
});

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return format(date, "EEEE, dd/MM", { locale: ptBR });
}

async function editTask(reminder: ReminderPayload) {
  await reminderStore.setReminder(reminder);

  emit("edit");
}

async function deleteTask(id: number) {
  await reminderStore.deleteReminder(id);
}
</script>

<style scoped></style>
