import { http } from "./http";
import type { ApiResponse } from "./http";

export const entityService = {
  async getContacts(): Promise<ApiResponse<any[]>> {
    return await http.request("GET", "/huggy/contacts");
  },
  async getChats(): Promise<ApiResponse<any[]>> {
    return await http.request("GET", "/huggy/chats");
  },
};
