import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// apiClient.interceptors.request.use(
//     async (config: InternalAxiosRequestConfig) => {
//         const session = await getSession(); 

//         if (session && session.user?.token) {
//             if (config.headers) {
//                 const headers = new AxiosHeaders(config.headers);
//                 headers.set('Authorization', `Bearer ${session.user?.token}`);
//                 config.headers = headers; 
//             }
//         }
//         return config; 
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

async function makeRequest<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: T | null,
    params?: Record<string, any>
): Promise<AxiosResponse<T, any>> {
    try {
        const url = `${BASE_URL}${endpoint}`;
        const response: AxiosResponse<T> = await apiClient({
            method,
            url,
            data,
            params,
        });
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('API call error:', error.response?.data);
            throw error.response?.data || 'Unknown error occurred';
        }
        throw new Error('An unknown error occurred');
    }
}

export default makeRequest;
