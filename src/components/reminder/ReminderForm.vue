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
          </VueDatePicker>
        </div>
      </div>

      <div class="grid gap-1">
        <Label>Vincular chat/contato</Label>
        <Select v-model="formData.entityId">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Selecionar" />
          </SelectTrigger>
          <SelectContent class="p-0" disable-type-ahead>
            <div class="flex flex-col overflow-y-hidden">
              <div class="border-b border-b-neutral-200 p-3">
                <Input v-model="entityQuery" @input="searchEntity" placeholder="Buscar" @keydown.stop />
              </div>
              <div class="flex flex-1 h-full">
                <div class="p-3 space-y-1 border-r border-r-neutral-200 flex-1">
                  <p class="text-sm font-medium mb-2">Entidade</p>
                  <RadioGroup v-model="formData.entity" default-value="chat">
                    <div class="flex items-center gap-1 mt-1.5">
                      <RadioGroupItem id="r1" value="chat" />
                      <Label for="r1">Chat</Label>
                    </div>
                    <div class="flex items-center gap-1">
                      <RadioGroupItem id="r2" value="contact" />
                      <Label for="r2">Contato</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div class="flex flex-col w-full p-3">
                  <p class="text-sm font-medium mb-2">Selecionar {{ formData.entity === "chat" ? "chat" : "contato" }}</p>
                  <div ref="scrollarea" class="max-h-[300px] overflow-y-auto" @scroll="onScroll">
                    <SelectGroup v-if="formData.entity === 'chat'">
                      <SelectItem v-for="chat in entityStore.getChats()" :value="chat.id">{{ chat.id }}</SelectItem>
                    </SelectGroup>
                    <SelectGroup v-else>
                      <SelectItem v-for="contact in entityStore.getContacts()" :value="contact.id">{{ contact.name }}</SelectItem>
                    </SelectGroup>
                  </div>
                </div>
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
            <SelectItem v-for="option in remindAtOptions" :key="option.value" :value="option.value">{{ option.label }}</SelectItem>
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
import debounce from "lodash/debounce";
import type { ReminderPayload, ReminderResponse } from "@/types/Reminder";

import { useEntityStore } from "@/store/entityStore";
import { atMidnight } from "@/utils/global";

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
const entityQuery = ref<string>("");
const loadingNextPage = ref<boolean>(false);
const entityPage = ref<Record<string, number>>({
  contact: 1,
  chat: 1,
});

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

watch(
  () => formData.value.entity,
  () => {
    entityPage.value[formData.value.entity] = 1;
    entityQuery.value = "";
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

async function loadNextPage(entity: string) {
  if (formData.value.entity === "contact") {
    await entityStore.fetchContacts(entityQuery.value, entityPage.value[entity]++);
  } else {
    await entityStore.fetchChats(entityQuery.value, entityPage.value[entity]++);
  }
}

async function onScroll(e: Event) {
  console.log("scrolling");
  const el = e.target as HTMLElement;

  const scrollBottom = el.scrollTop + el.clientHeight;
  const scrollHeight = el.scrollHeight;

  if (scrollBottom >= scrollHeight - 20 && !loadingNextPage.value) {
    loadingNextPage.value = true;

    await loadNextPage(formData.value.entity);

    loadingNextPage.value = false;
  }
}

const searchEntity = debounce(async (e) => {
  e.preventDefault();
  e.stopPropagation();

  entityPage.value[formData.value.entity] = 1;

  if (formData.entity === "contact") {
    entityStore.fetchContacts(entityQuery.value, 0);
  } else {
    entityStore.fetchChats(entityQuery.value, 0);
  }
}, 300);
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
