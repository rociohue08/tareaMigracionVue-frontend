/*aca vamos a manipular todo loq ue tiene que ver con la autenticacion  */

import {defineStore} from "pinia";
import { fetchWrapper } from "../helpers/fetchWrapper";
import type { User } from "../models/UserModel";
import router from "../routes/router";


//una llamada a nuestro fakebackend
const baseUrl = `${import.meta.env.VITE_API_URL}/users`

export const useAuthStore = defineStore({
    id: "auth",
    state: ()=>({
        auth: {} as {loading: Boolean, data?: User | null, refreshTokenTimeout: number|null}
    }),

    actions:{

        async login(username: string, password: string){
            this.auth.data= await fetchWrapper.post(`${baseUrl}/authenticate`,{username, password}, {credentials:'include'});

        },

        logout(){
            fetchWrapper.post(`${baseUrl}/revoke-token`,{}, {credentials:'include'});
            this.stopRefreshTokenTimer()
            this.auth.data = null; //seteamos data
            router.push({name:'/'});
        },
    
        //crar funcion para refrescar el token. consulta de manera asincrona xq esperamos una respuesta
        async refreshToken(){
            this.auth.data= await fetchWrapper.post(`${baseUrl}/refresh-token`,{}, {credentials:'include'});
            //una vez refrescado ahi nuevamente puedo comenzar la fucion
            this.startRefreshTokenTimer()
            /*lo que dispara el ciclo. entonces el usuario 
            se conecta empieza a correr el timeout (stratrefreshtokentimer) cuando este se cumple se
            ejecuta la funcion refreshtoken y asi es el ciclo*/

        },

      //empieza el tiempo de refresco del token
        startRefreshTokenTimer(){
            //si no existe nada en data o jwt no exite no hacemos nada
            if (!this.auth.data || !this.auth.data.JwtToken) return;
            //si existe tenemos q empezar a trabajar con el token
             //1ero vamos a parsear de un objeto json de base64


            const jwtBase64 = this.auth.data.JwtToken.split('.')[1];
            const decodedJwtToken = JSON.parse(atob(jwtBase64));
            //la funcion atob descodifica una cadena de datosque ha sido codificada utilizando la codificacion en base 64  
        
            //cuando vence el toke - crear timeout para refrescar el token antes de que espire
            const expires = new Date(decodedJwtToken.exp*1000)
            const timeout = expires.getTime() - Date.now()- (60*1000)
            this.auth.refreshTokenTimeout = setTimeout(this.refreshToken, timeout)
        },
        //para cortar el ciclo que creamos
        stopRefreshTokenTimer  (){
            if(this.auth.refreshTokenTimeout){
                //funcion nativa de typescript
                clearTimeout(this.auth.refreshTokenTimeout);
                this.auth.refreshTokenTimeout = null;

            }

        }
    }
})


