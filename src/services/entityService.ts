import { http } from "./http";
import type { ApiResponse } from "./http";

export const entityService = {
  async getContacts(query?: string, page: number = 0): Promise<ApiResponse<any[]>> {
    let params = `?page=${page}`;

    if (query) {
      params = `&q=${query}`;
    }

    return await http.request("GET", `/huggy/contacts${params}`);
  },
  async getChats(id?: number, page: number = 0): Promise<ApiResponse<any[]>> {
    let param = `?page=${page}`;

    if (id) {
      param += `&q=${id}`;
    }

    return await http.request("GET", `/huggy/chats${param}`);
  },
};
