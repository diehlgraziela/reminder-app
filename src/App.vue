<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useReminderStore } from "./store/reminderStore";
import { useEntityStore } from "./store/entityStore";
import { getFormattedDate } from "./utils/global";

const reminderStore = useReminderStore();
const entityStore = useEntityStore();

onMounted(() => {
  const date = new Date();

  reminderStore.fetchReminders({
    date: getFormattedDate(date, true),
  });
  entityStore.fetchContacts();
  entityStore.fetchChats();
});
</script>
