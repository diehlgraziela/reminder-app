<template>
    <div class="flex flex-col items-center justify-center gap-2">
        
        <Button @click="handleLoginWithHuggy">Login com a Huggy</Button>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { authService } from "@/services/authService";

import Button from "@/components/ui/button/Button.vue";
import { useUserStore } from "@/store/userStore";
import router from "@/router";

const route = useRoute();
const userStore = useUserStore();

const handleLoginWithHuggy = () => {
    authService.loginWith("huggy");
};

onMounted(async () => {
    if (route.query.access_token) {
        await userStore.fetchUser();
        router.push({ name: 'Index' });
    } else {
        userStore.clearUser();
    }
});
</script>