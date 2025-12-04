import { ref } from "vue";
import { defineStore } from "pinia";
import { entityService } from "@/services/entityService";

export const useEntityStore = defineStore("entity", () => {
  const contacts = ref<any[]>([]);
  const chats = ref<any[]>([]);

  function setContacts(value: any, append: boolean = true) {
    if (append) {
      contacts.value = [...contacts.value, ...value.data];
    } else {
      contacts.value = value.data;
    }
  }

  function getContacts(): any[] {
    return contacts.value;
  }

  function setChats(value: any, append: boolean = true) {
    console.log(append);
    if (append) {
      chats.value = [...chats.value, ...value.data];
    } else {
      chats.value = value.data;
    }
  }

  function getChats(): any[] {
    return chats.value;
  }

  async function fetchContacts(query?: string, page: number = 0) {
    const res = await entityService.getContacts(query, page);

    if (res.ok && res.data) {
      setContacts(res.data, page > 0);
    } else {
      if (page === 0) {
        setContacts([]);
      }
    }

    return res;
  }

  async function fetchChats(id?: number, page: number = 0) {
    const res = await entityService.getChats(id, page);

    if (res.ok && res.data) {
      setChats(res.data, page > 0);
    } else {
      if (page === 0) {
        setChats([]);
      }
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
