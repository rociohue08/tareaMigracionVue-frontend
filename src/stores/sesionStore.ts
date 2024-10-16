// stores/sesionStore.ts

import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { SesionState } from '../models/SesionState';
import { Sesion} from '../models/Sesion';


export const useSesionStore = defineStore('sesion', () => {
  const state = reactive<SesionState>({
    loading: false,
    data: null,
  });

  const update = (newSesion: Sesion) => {
    state.data = newSesion;
    state.loading = false;
  };

  return { state, update };
});
