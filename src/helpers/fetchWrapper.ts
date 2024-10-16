/*va a optener nuestra peticion y de ahi llamar a
las diferentes acciones del fakebackend*/

import {useAuthStore} from '../stores/authStore'
/*preguntar: si pongo @ me tira error la ruta solamente pero si pongo ..
jwtToken me da error en este mismo archivo  */

export const fetchWrapper ={
    get: request ('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete:request('DELETE')
}

function request (method: string){
    return (url: string, body?: any, {credentials}:{credentials?: RequestCredentials}={}) =>{
        const requestOptions: RequestInit ={
            method,
            headers: authHeader(url),
        };
        if (body){
            requestOptions.headers={
                ...requestOptions.headers,
                'Content-Type': 'application/json'
            };
            requestOptions.body =JSON.stringify(body);
        }
        if (credentials){
            requestOptions.credentials=credentials;
        }
        return fetch(url, requestOptions).then(handleResponse);
    }
}

//helper funtions= funciones auxiliares

function authHeader(url: string): Record<string, string>{
    const {auth}=useAuthStore();
    const isLoggedIn = !!auth.data?.JwtToken;
    const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);


    if (isLoggedIn && isApiUrl){
        return {Authorization: `Bearer ${auth.data?.JwtToken}`};
    }else{
        return {};
    }
}
async function handleResponse (response: Response):Promise<any>{
    const text = await response.text();
    const data: any =text ? JSON.parse(text) : null;

    if (!response.ok) {
        /*si la respuesta no esta bien traigo la autenticacion y el metdo logout 
        de nuestro authStore y vamos a devolver una respuesta y nos deslogueamos*/
        const {auth, logout} = useAuthStore();
        if ([401, 403].includes(response.status)&& auth.data){
            logout();
        } 
        const error= (data && data.message) || response.statusText;
        return Promise.reject(error);
    }
    return data;
}
