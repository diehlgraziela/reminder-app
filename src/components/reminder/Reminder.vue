<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button size="icon" variant="ghost">
        <CalendarDays />
      </Button>
    </PopoverTrigger>

    <PopoverContent align="end" :class="['p-0 h-[400px] flex transition-all duration-150 overflow-hidden', showTaskForm ? 'w-[620px]' : 'w-[310px]']">
      <div class="flex flex-col flex-1 gap-4 p-4 reminder-container border-r border-r-neutral-200">
        <ReminderHeader />

        <TaskList />

        <ReminderFooter :disabled="showTaskForm" @create-reminder="toggleTaskForm" />
      </div>

      <TaskForm v-if="showTaskForm" @cancel="toggleTaskForm" @save="saveTask" />
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ReminderHeader, { type Day } from "./ReminderHeader.vue";
import ReminderFooter from "./ReminderFooter.vue";
import TaskForm, { type FormData } from "../task/TaskForm.vue";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays } from "lucide-vue-next";
import TaskList from "../task/TaskList.vue";

const selectedDay = ref<Day>("today");
const showTaskForm = ref<boolean>(false);

function selectDay(day: Day) {
  selectedDay.value = day;
}

function toggleTaskForm() {
  showTaskForm.value = !showTaskForm.value;
}

function saveTask(data: FormData) {
  toggleTaskForm();
}
</script>

<style scoped></style>
