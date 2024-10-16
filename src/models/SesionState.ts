
import { Sesion } from './Sesion'

export interface SesionState {
    loading: boolean; // Estado de carga
    data: Sesion | null; // Datos de la sesión
}