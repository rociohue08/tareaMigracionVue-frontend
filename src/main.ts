// src/main.ts
import './assets/global.css'

import { createApp   } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/authStore'
import { fakeBackend } from './helpers/fakeBackend'


import App from './App.vue';

import router from './routes/router';  


fakeBackend()
startApp()

async function startApp(){
    const app = createApp(App);


    app.use(createPinia())
    app.use(router)

//comprobacion con try catch
try {
    const authStore = useAuthStore()
    await authStore.refreshToken()
} catch (error){
    //si no esta el refresh token ni la cookie
    console.warn('No hay datos de autenticacion para el usuario')
    console.info('Redirigiendo a Login Page')
    router.push('/login');
}

app.mount('#app')

}
