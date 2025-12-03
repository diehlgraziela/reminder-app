<template>
  <div class="layout bg-neutral-50">
    <Sidebar />

    <div class="page-container">
      <Navbar />
      <main>
        <!-- <router-view /> -->
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Sidebar from "./components/layout/Sidebar.vue";
import Navbar from "./components/layout/Navbar.vue";
</script>

<style scoped>
.layout {
  display: flex;
  height: 100%;
  width: 100%;
}

.page-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
