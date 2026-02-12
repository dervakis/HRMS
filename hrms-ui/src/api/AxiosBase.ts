import axios from "axios";

export const employeeApi = axios.create({
    baseURL: 'http://localhost:8080/api/employee',
    timeout: 3000
});