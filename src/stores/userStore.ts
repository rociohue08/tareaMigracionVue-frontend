import { defineStore } from 'pinia';
import { User } from '../models/UserModel'; 


export const useUserStore = defineStore('user', {
  state: () => ({
    user: {} as User, // Inicializa el estado como un objeto User
  }),
  actions: {
    setUser(userData: User) {
      this.user = userData; // Asigna los datos del formulario al estado
    },
  },
});
