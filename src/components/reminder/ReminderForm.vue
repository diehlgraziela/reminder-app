<template>
  <div class="form-container">
    <div class="form-header">
      <span class="font-medium text-sm"> Criar lembrete</span>
    </div>

    <div class="grid flex-1 gap-2">
      <div class="grid gap-1">
        <Label>Título</Label>
        <Input v-model="formData.title" id="title" type="text" placeholder="Ex: Ligar para Pedro" />
      </div>

      <div class="flex gap-2">
        <div class="grid gap-1">
          <Label for="date">Data</Label>
          <VueDatePicker
            v-model="formData.date"
            :locale="ptBR"
            :disabled-dates="isDateDisabled"
            ref="datepicker"
            placeholder="00/00/00"
            model-type="yyyy-MM-dd"
            :formats="{
              input: 'dd/MM/yy',
              preview: 'dd/MM/yyyy',
            }"
          >
            <template #input-icon>
              <CalendarDays size="16" class="ml-2" />
            </template>
            <template #action-buttons>
              <Button @click="applyDate">Aplicar</Button>
            </template>
            <template #time-picker></template>
          </VueDatePicker>
        </div>
        <div class="grid gap-1">
          <Label for="hour">Hora</Label>
          <VueDatePicker v-model="formData.time" :locale="ptBR" :min-time="minTime" ref="timepicker" placeholder="00:00" model-type="HH:mm:ss" time-picker>
            <template #input-icon>
              <Clock size="16" class="ml-2" />
            </template>
            <template #action-buttons>
              <Button @click="applyTime">Aplicar</Button>
            </template>
            <template #action-preview></template>
            <template #top-extra>teste</template>
          </VueDatePicker>
        </div>
      </div>

      <div class="grid gap-1">
        <Label>Vincular chat/contato</Label>
        <Select v-model="formData.entityId">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Selecionar" />
          </SelectTrigger>
          <SelectContent class="p-0">
            <div class="border-b border-b-neutral-200 p-3">
              <Input placeholder="Buscar" />
            </div>
            <div class="flex">
              <div class="p-3 space-y-1 border-r border-r-neutral-200">
                <p class="text-sm font-medium">Entidade</p>
                <RadioGroup v-model="formData.entity" default-value="chat">
                  <div class="flex items-center gap-1">
                    <RadioGroupItem id="r1" value="chat" />
                    <Label for="r1">Chat</Label>
                  </div>
                  <div class="flex items-center gap-1">
                    <RadioGroupItem id="r2" value="contact" />
                    <Label for="r2">Contato</Label>
                  </div>
                </RadioGroup>
              </div>
              <div class="p-3 space-y-1">
                <p class="text-sm font-medium">Selecionar {{ formData.entity === "chat" ? "chat" : "contato" }}</p>
                <SelectGroup v-if="formData.entity === 'chat'">
                  <SelectItem v-for="chat in entityStore.getChats()" :value="chat.id">{{ chat.id }}</SelectItem>
                </SelectGroup>
                <SelectGroup v-else>
                  <SelectItem v-for="contact in entityStore.getContacts()" :value="contact.id">{{ contact.name }}</SelectItem>
                </SelectGroup>
              </div>
            </div>
          </SelectContent>
        </Select>
      </div>

      <div class="grid gap-1">
        <Label>Lembrar em</Label>
        <Select v-model="formData.notifyBeforeMinutes">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Selecionar" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="option in remindAtOptions" :key="option.value" :value="option.value">{{ option.label }}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div class="form-footer">
      <Button variant="ghost" @click="cancel">Cancelar</Button>
      <Button :disabled="isSaveDisabled" @click="save"> Salvar </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import { CalendarDays, Clock } from "lucide-vue-next";
import { ptBR } from "date-fns/locale";
import type { ReminderPayload, ReminderResponse } from "@/types/Reminder";

import { useEntityStore } from "@/store/entityStore";
import { atMidnight } from "@/utils/global";
import { useReminderStore } from "@/store/reminderStore";

export type FormData = {
  title: string;
  date: string;
  time: string;
  entity: string;
  entityId: number | null;
  notifyBeforeMinutes: number;
};

type Props = {
  reminder?: ReminderPayload;
};

type Emits = {
  (e: "save", data: FormData): void;
  (e: "cancel"): void;
  (e: "showPicker", show: boolean): void;
};

const defaultFormData: FormData = {
  title: "",
  date: "",
  time: "",
  entity: "chat",
  entityId: null,
  notifyBeforeMinutes: 0,
};

const remindAtOptions = [
  {
    label: "Na hora do evento",
    value: 0,
  },
  {
    label: "1min antes",
    value: 1,
  },
  {
    label: "10min antes",
    value: 10,
  },
  {
    label: "30min antes",
    value: 30,
  },
  {
    label: "1h antes",
    value: 60,
  },
];

const timeLabels = {
  hour: "Hora",
  minute: "Minuto",
};

const emit = defineEmits<Emits>();
const props = defineProps<Props>();

const entityStore = useEntityStore();

const datePickerRef = useTemplateRef("datepicker");
const timePickerRef = useTemplateRef("timepicker");
const formData = ref<FormData>(defaultFormData);

const isSaveDisabled = computed(() => {
  return formData.value.title.trim() === "" || formData.value.date === "" || formData.value.time === "" || formData.value.notifyBeforeMinutes === undefined;
});

const minTime = computed(() => {
  if (new Date(formData.value.date) > new Date()) {
    return null;
  }

  const now = new Date();

  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
  };
});

watch(
  () => props.reminder,
  (reminder: ReminderResponse) => {
    if (!reminder) return;

    const { date, time } = parseScheduledAt(reminder.scheduled_at);
    const notifyBefore = getDiffInMinutes(reminder.scheduled_at, reminder.notify_at);

    const formattedEntityId = reminder.entity === "contact" ? String(reminder.entity_id) : reminder.entity_id;

    formData.value = {
      title: reminder.title,
      date: date,
      time: time,
      entity: reminder.entity,
      entityId: formattedEntityId ?? null,
      notifyBeforeMinutes: notifyBefore,
    };
  },
  {
    immediate: true,
  }
);

function isDateDisabled(date: Date) {
  const today = atMidnight(new Date());
  return atMidnight(date) < today;
}

function applyDate() {
  datePickerRef.value?.selectDate();
}

function applyTime() {
  timePickerRef.value?.selectDate();
}

function parseScheduledAt(iso: string) {
  const date = new Date(iso);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return {
    date: `${yyyy}-${mm}-${dd}`,
    time: `${hh}:${min}:00`,
  };
}

function getDiffInMinutes(scheduledIso: string, notifyIso: string) {
  const scheduled = new Date(scheduledIso);
  const notify = new Date(notifyIso);

  const diffMs = scheduled.getTime() - notify.getTime();
  return Math.floor(diffMs / 60_000);
}

function save() {
  if (isSaveDisabled.value) return;

  const formattedData: ReminderPayload = {
    id: props.reminder?.id || undefined,
    title: formData.value.title,
    entity: formData.value.entityId ? formData.value.entity : null,
    notify_before_minutes: formData.value.notifyBeforeMinutes,
    entity_id: formData.value.entityId,
    scheduled_at: `${formData.value.date} ${formData.value.time}`,
  };

  emit("save", formattedData);
}

function cancel() {
  formData.value = defaultFormData;
  emit("cancel");
}
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 1px solid var(--neutral-40);
  padding: 16px;
  flex: 1;
}

.form-footer {
  display: flex;
  justify-content: space-between;
}
</style>
