<template>
  <div class="reminder-footer">
    <Button class="w-full" :disabled="disabled" @click="createReminder"> Criar lembrete </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";

type Props = {
  disabled?: boolean;
};

type Emits = {
  (e: "createReminder"): void;
};

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});
const emit = defineEmits<Emits>();

function createReminder() {
  if (props.disabled) return;

  emit("createReminder");
}
</script>

<style scoped></style>
