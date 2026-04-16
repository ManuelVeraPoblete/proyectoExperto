// Cambia esta IP por la IP de tu máquina en la red local cuando pruebes en dispositivo físico
// Para emulador Android usa: http://10.0.2.2:3001/api
// Para dispositivo físico usa: http://192.168.x.x:3001/api
//export const API_BASE_URL = 'http://192.168.1.30:3001/api';
export const API_BASE_URL = 'http://localhost:3001/api';
export const SERVER_URL = API_BASE_URL.replace(/\/api$/, '');

/** Convierte rutas relativas del backend (/uploads/...) en URLs absolutas */
export const toAbsoluteUrl = (url: string | null | undefined): string | undefined => {
  if (!url) return undefined;
  return url.startsWith('http') ? url : `${SERVER_URL}${url}`;
};
