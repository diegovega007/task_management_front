<template>
      <v-app-bar color="blue" :elevation="2" rounded flat class="bar">
        <v-toolbar-title>App de Tareas</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="white" text @click="redirectToLogin">Login</v-btn>
      </v-app-bar>
  
      <v-main>
        <v-container class="align-center">
          <TaskManagement />
        </v-container>
      </v-main>
  </template>
  
  <script setup>
  import TaskManagement from '../components/TaskManagement.vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const redirectToLogin = () => {
    router.push('/login');
  };
  </script>
  
  <style scoped>
  .align-center {
    display: block;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 64px); 
  }
  </style>