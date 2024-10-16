/*este modelo contiene el PAYLOAD de nuestro JWT
JWT: dividido en 3 partes
+HEADER: informacion 
+PAYLOAD: parte q podemos manipular por asi decirlo,
en la cual esta encriptada la informacion del usuario
a nosotros nos interesa el payload.
+SIGNATURE: no lo manipulamos pero es el tipo de 
encriptacion y demas
*/


//os modelos almacenan y manejan los datos que alimentan a la interfaz
export interface JwtPayload {
    exp: number, //exp = expired
}