import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configuração da URL base
const getBaseURL = () => {
    if (__DEV__) {
        const platformUrls = {
            android: 'http://192.168.1.76/inautom/backend/web',
            ios: 'http://192.168.1.76/inautom/backend/web',
            web: 'http://192.168.1.76/inautom/backend/web', // Para web
            default: 'http://192.168.1.76/inautom/backend/web'
        };
        return platformUrls[Platform.OS] || platformUrls.default;
    }
    return 'https://api.inautom.com'; // URL de produção - ajuste conforme necessário
};

const API_BASE_URL = getBaseURL();
console.log('🌐 URL da API:', API_BASE_URL);

// Configuração do cliente Axios
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 15000, // 15 segundos é um tempo mais razoável
    withCredentials: false // Importante para CORS
});

// Interceptor para adicionar o token de autenticação
apiClient.interceptors.request.use(
    async (config) => {
        try {
            // Obter dados do user (onde o token está armazenado)
            const userJson = await AsyncStorage.getItem('user');
            if (userJson) {
                const user = JSON.parse(userJson);
                // Usar auth_key como token de autenticação
                if (user.auth_key) {
                    config.headers['Authorization'] = `Bearer ${user.auth_key}`;
                    console.log('🔑 Token adicionado');
                }
            }
        } catch (error) {
            console.warn('🔑 Erro ao obter token:', error);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar respostas e erros
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Dados do erro para debugging
        const errorInfo = {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data
        };

        // Registrar erros de CORS de forma mais amigável
        if (!error.response) {
            console.error('🚨 Erro na conexão com a API:', error.message);
            if (error.message.includes('Network Error') || error.message.includes('CORS')) {
                console.error('🔒 Possível erro de CORS ou rede. Verifique sua conexão ou configurações do servidor.');
            }
        }
        // Tratar erro 500 (interno do servidor)
        else if (error.response.status === 500) {
            console.error('🔥 Erro interno do servidor:', errorInfo);
        }
        // Tratar erro 401 (não autorizado)
        else if (error.response.status === 401) {
            console.error('🔐 Não autorizado:', errorInfo);
            // Limpar credenciais e redirecionar para login
            AsyncStorage.removeItem('user');
        }
        // Outros erros
        else {
            console.error('🚨 Erro na requisição:', errorInfo);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
