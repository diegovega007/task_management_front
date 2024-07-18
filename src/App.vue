<template>
  <v-app>
    <v-main>
      <v-container class="align-center">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { RouterView } from 'vue-router';
</script>

<style scoped>
  .align-center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>