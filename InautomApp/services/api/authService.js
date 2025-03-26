import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// URL base simplificada para evitar erro de window is not defined
const API_URL = 'http://192.168.1.76/inautom/backend/web';

const authService = {
    login: async (username, password) => {
        try {
            console.log('A tentar login com:', username);

            // Validar inputs
            if (!username || !password) {
                throw new Error('Username e password são obrigatórios');
            }

            // URL do endpoint
            const url = `${API_URL}/api/auth/login`;
            console.log('Enviar requisição para:', url);

            // Implementação usando fetch (mais básica, menos problemas de CORS)
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'omit',
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            // Verificar se a resposta foi bem-sucedida
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('Resposta recebida:', data);

            if (data && data.success) {
                // Guardar dados do utilizador
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                console.log('Dados do utilizador guardados com sucesso');
                return data;
            } else {
                throw new Error(data.message || 'Erro no login');
            }
        } catch (error) {
            console.error('Erro no login:', error.message);
            throw error;
        }
    },

    // Implementação alternativa usando Axios caso prefira
    loginWithAxios: async (username, password) => {
        try {
            console.log('A tentar login com Axios:', username);

            // Validar inputs
            if (!username || !password) {
                throw new Error('Username e password são obrigatórios');
            }

            // Criar dados para envio
            const data = {
                username: username,
                password: password
            };

            console.log('Enviar requisição para:', `${API_URL}/api/auth/login`);

            // Configurar cabeçalhos
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 10000 // 10 segundos
            };

            // Fazer a requisição
            const response = await axios.post(`${API_URL}/api/auth/login`, data, config);

            console.log('Resposta recebida:', response.data);

            if (response.data && response.data.success) {
                // Guardar dados do utilizador
                await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
                console.log('Dados do utilizador guardados com sucesso');
                return response.data;
            } else {
                throw new Error(response.data.message || 'Erro no login');
            }
        } catch (error) {
            console.error('Erro no login com Axios:', error.message);
            throw error;
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('user');
        } catch (error) {
            console.error('Erro no logout:', error);
        }
    },

    isAuthenticated: async () => {
        try {
            const user = await AsyncStorage.getItem('user');
            return !!user;
        } catch {
            return false;
        }
    },

    getCurrentUser: async () => {
        try {
            const user = await AsyncStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    }
};

export default authService;
