import { http } from "./http";
import type { ApiResponse } from "./http";

export const authService = {
    loginWith(provider: string) {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}/redirect`;
    },
    async logout(): Promise<ApiResponse<null>> {
        return await http.request<null>("POST", "/logout");
    }
}