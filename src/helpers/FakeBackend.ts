/*fakebackend que vamos a usar del lado del cliente
 para poder resolver las solicitudes que nosotros hagamos*/


export { fakeBackend };

import type { User              } from '../models/UserModel'
import type { JwtPayload        } from '../models/JwtModel';
import type { AuthRequestBody   } from '../models/AuthReqModel';


/*localstorage: almacenamiento local q nos ofrece el navegador
donde podemos alojar infromacion, pero el problema es que es inseguro
cualquiera puede acceder. Pero como estamos con un backend falso
nos va a servir de base de datos */

// Array de usuarios en localstorage
const usersKey = 'vue-3-jwt-refresh-token-users';
const users: User[] = JSON.parse(localStorage.getItem(usersKey) || '[]'); //lo pasamos a objeto porque localstorage guarda todo en json
/* constante users: que va  ser de tipo  User[]  o sea nuestro modelo user */


// Agregar un usuario apra pruebas en localstorage si no hay ninguno
const user: User = { 
    id: 1, 
    firstName: 'Matias', 
    lastName: 'Orellana', 
    username: 'test', 
    password: 'test',
    isAdmin: true, 
    refreshTokens: [] 
}
// si no hay usuarios creamos uno y lo guardamos en almacenamiento local
if (!users.length) {
    users.push(user);
    localStorage.setItem(usersKey, JSON.stringify(users));
}


function fakeBackend() {
    /*interceptamos todos los fetch que se hagan. un fetch lo haciamos cuando queriamos
    consultar un JSON, consultar una api */
    const realFetch = window.fetch;

    /*cuando hacemos un fetch le tenemos que pasar una ruta(url)
    y le tendriamos q pasar ciertas opciones x ej un header donde le decimos 
    que tipo de contenido estamos pasando si es json, le pasamos autorizacin un token
    y tambien le pasamos el body de lo queriamos,etc
    opts: options
    */

    window.fetch = function (url, opts: any): Promise<Response> {
        return new Promise((resolve, reject) => {
            // Envolvemos la funcion en un setTimeout para simular una llamada a API
            setTimeout(handleRoute, 1000); //le pasamos la funcion handleroute y q tarde 1seg

            // manejamos las rutas falsas como si hicieramos llamados api
            function handleRoute() { 
                const { method } = opts; //dependiendo del metodo vamos a tomar una o otra decision
                switch (true) {
                    case url.toString().endsWith('/users/authenticate') && method === 'POST':
                        return authenticate(); //va a retornar una funcion de autenticacion
                    case url.toString().endsWith('/users/refresh-token') && method === 'POST':
                        return refreshToken();//va a retornar una funcion 
                    case url.toString().endsWith('/users/revoke-token') && method === 'POST':
                        return revokeToken();//va a retornar una funcion que va a cortar/eliminar ese token x ej en un log out
                    case url.toString().endsWith('/users') && method === 'GET':
                        return getUsers();
                    default:
                        // Pass through any requests not handled above
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            // Funciones de rutas

            function authenticate() {
                const { username, password } = body<AuthRequestBody>();
                const user = users.find(x => x.username === username && x.password === password);

                if (!user) return error('Usuario o contraseña incorrectos');

                // Agregar refresh token al usuario
                user.refreshTokens.push(generateRefreshToken());
                localStorage.setItem(usersKey, JSON.stringify(users));

                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isAdmin: user.isAdmin,
                    jwtToken: generateJwtToken(),
                });
            }

            function refreshToken() {
                const refreshToken = getRefreshToken();
                if (!refreshToken) return unauthorized();

                const user = users.find(x => x.refreshTokens.includes(refreshToken));
                if (!user) return unauthorized();

                // Reemplazar refresh token viejo por uno nuevo y guardar
                user.refreshTokens = user.refreshTokens.filter(x => x !== refreshToken);
                user.refreshTokens.push(generateRefreshToken());
                localStorage.setItem(usersKey, JSON.stringify(users));

                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isAdmin: user.isAdmin,
                    jwtToken: generateJwtToken(),
                });
            }

            function revokeToken() {
                if (!isLoggedIn()) return unauthorized();

                const refreshToken = getRefreshToken();
                const _user = users.find(x => x.refreshTokens.includes(refreshToken));

                // Revocar token y guardar en almacenamiento local
                if(_user !==  undefined) {
                    _user.refreshTokens = _user.refreshTokens.filter(x => x !== refreshToken);
                    localStorage.setItem(usersKey, JSON.stringify(users));
                }

                return ok({msg: 'Token revocado'});
            }

            // funcion para obtener usuarios, controla  si el usuario está logueado
            function getUsers() {
                if (!isLoggedIn()) return unauthorized();
                return ok(users);
            }


            function ok(body: any) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) } as Response);
            }

            function unauthorized() {
                resolve({ status: 401, text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' })) } as Response);
            }
            function error(message: string) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) } as Response);
            }

            function isLoggedIn(): boolean {
                // Chequea si el JWT esta en el auth header
                const authHeader = opts.headers?.['Authorization'] || '';
                if (!authHeader.startsWith('Bearer fake-jwt-token')) return false;

                // Chequea si el token expiro
                try {
                    const jwtToken = JSON.parse(atob(authHeader.split('.')[1])) as JwtPayload;
                    const tokenExpired = Date.now() > jwtToken.exp * 1000;
                    if (tokenExpired) return false;
                } catch {
                    return false;
                }

                return true;
            }

            //funciones auxiliares
            function body<T>(): T {
                return opts.body ? JSON.parse(opts.body) : {} as T;
            }

            function generateJwtToken(): string {
                // Crea token que expira en 2 minutos
                const tokenPayload: JwtPayload = { exp: Math.round(Date.now() / 1000 + 2 * 60) };
                const fakeJwtToken: string = `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
                return fakeJwtToken;
            }

            function generateRefreshToken(): string {
                const token = new Date().getTime().toString();
                // Agregar un refresh token que expira en 7 dias
                const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
                document.cookie = `fakeRefreshToken=${token}; expires=${expires}; path=/`;

                return token;
            }

            function getRefreshToken(): string {
                // Obtener el refresh token de la cookie
                return (document.cookie.split(';').find(x => x.includes('fakeRefreshToken')) || '=').split('=')[1];
            }
        });
    };
}