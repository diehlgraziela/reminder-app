import { ref } from "vue";
import { defineStore } from "pinia";
import { entityService } from "@/services/entityService";

export const useEntityStore = defineStore("entity", () => {
  const contacts = ref<any[]>([]);
  const chats = ref<any[]>([]);

  function setContacts(value: any) {
    contacts.value = value.data;
  }

  function getContacts(): any[] {
    return contacts.value;
  }

  function setChats(value: any) {
    chats.value = value.data;
  }

  function getChats(): any[] {
    return chats.value;
  }

  async function fetchContacts() {
    const res = await entityService.getContacts();

    if (res.ok && res.data) {
      setContacts(res.data);
    } else {
      setContacts([]);
    }

    return res;
  }

  async function fetchChats() {
    const res = await entityService.getChats();

    if (res.ok && res.data) {
      setChats(res.data);
    } else {
      setChats([]);
    }

    return res;
  }

  const state = {};

  const actions = {
    fetchContacts,
    fetchChats,
    getContacts,
    getChats,
  };

  return {
    ...state,
    ...actions,
  };
});
