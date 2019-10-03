import http from './httpService';
import { url } from '../config/config.json';

const apiEndpoint = `${url}/auth`;

export function login(email, password) {
  return http.post(apiEndpoint, {email, password});
}
