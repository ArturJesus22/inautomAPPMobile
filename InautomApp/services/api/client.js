import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configuração da URL base
const getBaseURL = () => {
    if (__DEV__) {
        const platformUrls = {
            android: 'http://10.0.2.2/inautom/backend/web',
            ios: 'http://192.168.1.75/inautom/backend/web',
            default: 'http://192.168.1.75/inautom/backend/web'
        };
        return platformUrls[Platform.OS] || platformUrls.default;
    }
    return 'https://192.168.1.75/inautom/backend/web';
};

const API_BASE_URL = getBaseURL();
console.log('🌐 URL da API:', API_BASE_URL);

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 60000
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
                    console.log('🔑 Token adicionado:', user.auth_key);
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
// api/client.js (adicione isso ao interceptor de resposta)
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Exibir informações detalhadas sobre o erro
        console.error('🚨 Erro na requisição:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data
        });

        // Tratar erro 500
        if (error.response && error.response.status === 500) {
            console.error('🔥 Erro interno do servidor. Detalhes:', error.response.data);
            //  pode tentar novamente ou mostrar uma mensagem amigável ao user
        }

        return Promise.reject(error);
    }
);


export default apiClient;
