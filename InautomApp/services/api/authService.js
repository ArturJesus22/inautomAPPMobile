import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.168/inautom/backend/web';

const authService = {
        login: async (username, password) => {
            try {
                console.log('Tentando login com:', username);

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
                console.error('Erro no login:', error.message);
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
