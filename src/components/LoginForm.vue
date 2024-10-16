<script setup lang="ts">
//import {reactive} from 'vue';
//import { User } from '../models/UserModel';

//importaciones locales
import { useUserStore } from '../stores/userStore'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

//importaciones de libreria
import {Form, Field} from 'vee-validate'
//importar modulo
import * as Yup from 'yup'

const uStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()


//hacemos esquema
const schema = Yup.object().shape({
  username: Yup.string().required('Usuario Requeriro'),
  password: Yup.string().required('Password es Requerido'),
})

if (authStore.auth.data){
  //si existe, pusheamos a la ruta de home
  router.push('/')
}

function handleSubmit(values: any, { setErrors }:any){
  const {username, password } = values;
  return authStore.login(username, password).then(()=>{
    router.push('/')
  })
  .catch(error=> setErrors({apiError: error}))
}

</script>


<template>
 
 <!-- no vamos a usar el from html sino el que trae vue-validate -->
      <Form @submit="handleSubmit" :validation-schema="schema" v-slot="{errors, isSubmitting}">
        <h1>LOGIN</h1>
        <div class="input-bx">
          <field name="username" type="text" :class="{'is-valid': errors.usarname || errors.apiError}" placeholder="Usuario" required />
          <ion-icon class="icon" name="person-circle"></ion-icon>
          <div class="invalid-feedback">
            {{ errors.usarname }}
          </div>
        </div>
        <div class="input-bx">
          <Field name="password" type="password" :class="{'is-valid': errors.password || errors.apiError}" placeholder="Contraseña" required />
          <ion-icon class="icon" name="lock-closed"></ion-icon>
          <!-- mensaje de error -->
          <div class="invalid-feedback">
            {{ errors.usarname }}
          </div>
        </div>
        <div class="remember-forgot">
          <label><input type="checkbox" name="remember" /> Recordarme</label>
          <a href="#">Olvidaste tu contraseña</a>
        </div>
        <button type="submit" class="btn">
          <span v-show="isSubmitting" class="loader"></span>
          <p v-show="!isSubmitting">Ingresar</p>
        </button>
        <div v-if="errors.apiError" class="error-alert">{{ errors.apiError }}</div>
      </Form>

  </template>
  

  
  <style scoped>

 h1 {
    font-size: 3em;
    text-align: center;
    font-family:monospace;
}

.input-bx {
    position: relative;
    width: 100%;
    height: 50px;
    margin: 30px 0;
}

.input-bx input {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
    border: 2px solid rgba(255, 255, 255, .2);
    border-radius: 15px;
    color: #fff;
    padding: 20px 45px 20px 20px;
}


.input-bx input.is-invalid{
  width: 100%;
  height: 100%;
  background: slategray;
  color: red;
}

.input-bx input::placeholder {
    color: #fff;
}

.input-bx input.is-invañid::placeholder {
    color: #c11919;
}

.input-bx .icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5em;
}


.input-bx .invalid-feedback{
  padding:  0px 16px;
  margin: 0;
  color:red;
  font-weight: 300;
}

.remember-forgot {
    display: flex;
    justify-content: space-between;
    font-size: 1.2em;
    margin: -15px 0 15px;
}

.remember-forgot label input {
    accent-color: #fff;
    margin-right: 3px;
}

.remember-forgot a {
    color: #fff;
    text-decoration: none;
}

.remember-forgot a:hover {
    text-decoration: underline;
}

button {
    width: 100%;
    height: 50px;
    border-radius: 15px;
    border: none;
    outline: none;
    box-shadow: 0 0 10px rgb(255, 255, 255);
    cursor: pointer;
    font-size: 1.2em;
    font-weight: 600;
    background-color: rgb(110, 10, 119);
    color: #ffffff;
}

button p {
  font-size: 1.2em;
  font-weight: 600;
  color: darkslategray;
}

/* animacion de loader */
.loader {
  margin: auto 0;
  width:24px ;
  height: 24px;
  border: 4px solid purple;
  border-bottom-color: transparent;
  border-radius: 50%;
  display:inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinitive;
}
@keyframes rotation{
  0%{
    transform: rotate(0deg);
  }
  100%{
    transform: rotate(360deg);
  }
}

.error-alert{
  margin: 16px 0 0 0;
  width: 100%;
  background:transparent;
  color: red;
  text-align: center;
  font-weight: 400;
}

  </style>
  