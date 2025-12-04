<template>
  <div class="flex justify-between items-center px-3">
    <div class="flex gap-1">
      <template v-for="option in dateOptions" :key="option.id">
        <VueDatePicker ref="datepicker" v-if="option.icon" v-model="selectedDateRange" :locale="ptBR" range>
          <template #trigger>
            <Button size="icon" variant="outline" :selected="option.id === selectedDay">
              <CalendarDays />
            </Button>
          </template>
          <template #time-picker></template>
          <template #action-buttons>
            <Button @click="applyDate">Aplicar</Button>
          </template>
        </VueDatePicker>
        <Button v-else variant="outline" :selected="option.id === selectedDay" @click="selectDay(option.id)">
          {{ option.label }}
        </Button>
      </template>
    </div>

    <Button size="icon" variant="ghost">
      <CircleQuestionMark />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, onMounted } from "vue";
import { CircleQuestionMark, CalendarDays } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import type { ReminderFilter } from "@/types/Reminder";
import { getFormattedDate } from "@/utils/global";

export type Day = "today" | "tomorrow" | "custom";
type DateOption = {
  id: Day;
  label?: string;
  icon?: string;
};

type Emits = {
  (e: "selectDay", payload: ReminderFilter): void;
  (e: "showPicker", show: boolean): void;
};

const dateOptions: DateOption[] = [
  { id: "today", label: "Hoje" },
  { id: "tomorrow", label: "Amanhã" },
  { id: "custom", icon: "calendar" },
];

const emit = defineEmits<Emits>();

const datePickerRef = useTemplateRef("datepicker");
const selectedDateRange = ref<Date[]>([]);
const selectedDay = ref<Day>("today");

function selectDay(day: Day) {
  selectedDay.value = day;

  if (day === "today" || day === "tomorrow") {
    const date = new Date();

    if (day === "tomorrow") {
      date.setDate(date.getDate() + 1);
    }

    const formatted = getFormattedDate(date, true);

    emit("selectDay", {
      date: formatted,
    });

    return;
  }

  if (day === "custom") {
    if (!selectedDateRange.value || selectedDateRange.value.length === 0) return;

    const [start, end] = selectedDateRange.value;

    if (start && !end) {
      const formatted = getFormattedDate(start, true);

      emit("selectDay", {
        date: formatted,
      });

      return;
    }

    if (start && end) {
      const from = getFormattedDate(start, true);
      const to = getFormattedDate(end, true);

      emit("selectDay", {
        from,
        to,
      });
    }
  }
}

function applyDate() {
  datePickerRef.value?.[0]?.selectDate();
  selectDay("custom");
}

onMounted(() => {
  selectDay("today");
});
</script>

<style scoped></style>
