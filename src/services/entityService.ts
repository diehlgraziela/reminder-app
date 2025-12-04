import { http } from "./http";
import type { ApiResponse } from "./http";

export const entityService = {
  async getContacts(query?: string): Promise<ApiResponse<any[]>> {
    let params = "";

    if (query) {
      params = `?q=${query}`;
    }

    return await http.request("GET", `/huggy/contacts${params}`);
  },
  async getChats(id?: number): Promise<ApiResponse<any[]>> {
    let param = "?situation=in_chat";

    if (id) {
      param += `&q=${id}`;
    }

    return await http.request("GET", `/huggy/chats${param}`);
  },
};
