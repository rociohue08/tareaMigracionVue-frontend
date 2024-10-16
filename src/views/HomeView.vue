<script setup lang="ts">
import { reactive } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/authStore';
import { useSesionStore } from '../stores/sesionStore';
import type { User } from '../models/UserModel';

const authStore = useAuthStore();
const userStore = useUserStore();
const sesionStore = useSesionStore();

const user: User = reactive<User>(userStore.user);

// Función para logout
function logout() {
  authStore.logout();
}

// Función para formatear fechas
const formatDate = (date: Date | undefined) => {
  return date ? new Date(date).toLocaleString() : '';
};
</script>


<template class="wrapper">
  <div>
    <h1>¡Bienvenido! {{ user.username }}</h1>
    <h2>Rol: {{ user.isAdmin }}</h2>

    <h2>Información de Sesión:</h2>
    <p>Payload: {{ sesionStore.state.data?.payload }}</p>
    <p>Creado en: {{ formatDate(sesionStore.state.data?.createdAt) }}</p>
    <p>Expira en: {{ formatDate(sesionStore.state.data?.expiresAt) }}</p>
    <p>Refrescar en: {{ formatDate(sesionStore.state.data?.refreshAt) }}</p>

    <button @click="logout" class="btnhome">Logout</button>
  </div>

  
</template>

<style scoped>
h1 {
  color: aliceblue;
  font-family: 'Courier New', Courier, monospace;
  font-size: 30px;
}

.wrapper {
  width: 400px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  color: #fff;
  padding: 30px 40px;
  border-radius: 15px;
}

.btnhome {
  background-color: blueviolet;
  border-radius: 15px;
}
</style>
