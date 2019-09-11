import http from './httpService';
import { url } from '../config/config.json';

export function getGenres() {
  return http.get(`${url}/genres`);
}
