<template>
  <div class="form-container">
    <div class="form-header">
      <span class="font-medium text-sm"> Criar lembrete</span>
    </div>

    <div class="grid flex-1 gap-2">
      <div class="grid gap-1">
        <Label for="title">Título</Label>
        <Input v-model="formData.title" id="title" type="text" placeholder="Ex: Ligar para Pedro" />
      </div>

      <div class="flex gap-2">
        <div class="grid gap-1">
          <Label for="date">Data</Label>
          <VueDatePicker
            v-model="formData.date"
            :locale="ptBR"
            ref="datepicker"
            placeholder="00/00/00"
            model-type="yyyy-MM-dd"
            :formats="{
              input: 'dd/MM/yy',
              preview: 'dd/MM/yyyy',
            }"
          >
            <template #action-buttons>
              <Button @click="applyDate">Aplicar</Button>
            </template>
            <template #time-picker></template>
          </VueDatePicker>
        </div>
        <div class="grid gap-1">
          <Label for="hour">Hora</Label>
          <VueDatePicker v-model="formData.time" :locale="ptBR" ref="timepicker" placeholder="00:00" model-type="HH:mm" time-picker>
            <template #action-buttons>
              <Button @click="applyTime">Aplicar</Button>
            </template>
            <template #action-preview></template>
            <template #top-extra>teste</template>
          </VueDatePicker>
        </div>
      </div>

      <div class="grid gap-1">
        <Label for="title">Vincular chat/contato</Label>
        <Select>
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Selecionar" />
          </SelectTrigger>
          <SelectContent>
            <div>
              <Input placeholder="Buscar" />
            </div>
            <div class="flex">
              <div class="p-3 space-y-1 border-r border-r-neutral-200">
                <p class="text-sm font-medium">Entidade</p>
                <RadioGroup v-model="linkTo" default-value="chat">
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
                <p class="text-sm font-medium">Selecionar {{ linkTo === "chat" ? "chat" : "contato" }}</p>
                <SelectGroup>
                  <SelectItem value="none">Amanda Barbosa</SelectItem>
                </SelectGroup>
              </div>
            </div>
          </SelectContent>
        </Select>
      </div>

      <div class="grid gap-1">
        <Label>Lembrar em</Label>
        <Select v-model="formData.remindAt">
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
      <Button :disabled="saveDisabled" @click="save"> Salvar </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import { CalendarDays, Clock } from "lucide-vue-next";
import { ptBR } from "date-fns/locale";

export type FormData = {
  title: string;
  date: string;
  time: string;
  contact: string;
  remindAt: number;
};

type Props = {
  task?: any;
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
  contact: "",
  remindAt: 0,
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

const datePickerRef = useTemplateRef("datepicker");
const timePickerRef = useTemplateRef("timepicker");
const linkTo = ref<"contact" | "chat">("chat");
const formData = ref<FormData>(defaultFormData);

const saveDisabled = computed(() => {
  return formData.value.title.trim() === "" || formData.value.date === "" || formData.value.time === "" || formData.value.contact === "" || formData.value.remindAt === undefined;
});

function applyDate() {
  datePickerRef.value?.selectDate();
}

function applyTime() {
  timePickerRef.value?.selectDate();
}

function selectRemindAt(value: number) {
  formData.value.remindAt = value;
}

function save() {
  if (saveDisabled.value) return;

  emit("save", formData.value);
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
