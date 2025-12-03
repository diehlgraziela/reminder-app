<template>
  <div class="flex justify-between items-center">
    <div class="flex gap-1">
      <template v-for="option in dayOptions" :key="option.id">
        <VueDatePicker ref="datepicker" v-if="option.icon" v-model="selectedDateRange" range>
          <template #trigger>
            <Button size="icon" variant="outline">
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
import { CircleQuestionMark, CalendarDays } from "lucide-vue-next";
import { ref, useTemplateRef } from "vue";
import { Button } from "@/components/ui/button";
import { VueDatePicker } from "@vuepic/vue-datepicker";

export type Day = "today" | "tomorrow" | "custom";
type DayOption = {
  id: Day;
  label?: string;
  icon?: string;
};

type Emits = {
  (e: "selectDay", day: Day): void;
  (e: "showPicker", show: boolean): void;
};

const emit = defineEmits<Emits>();

const datePickerRef = useTemplateRef("datepicker");
const selectedDateRange = ref();

const dayOptions: DayOption[] = [
  { id: "today", label: "Hoje" },
  { id: "tomorrow", label: "Amanhã" },
  { id: "custom", icon: "calendar" },
];

const selectedDay = ref<Day>("today");

function selectDay(day: Day) {
  selectedDay.value = day;
  emit("selectDay", day);
}

function applyDate() {
  datePickerRef.value?.[0]?.selectDate();
}
</script>

<style scoped></style>
