import http from './httpService';
import { url } from '../config/config.json';

const apiEndpoint = `${url}/users`;

export function register(user) {
  return http.post(apiEndpoint, {
    email: user.username,
    password: user.password,
    name: user.name 
  });
}
