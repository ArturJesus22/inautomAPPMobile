import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const profileService = {
  /**
   * Obtém os dados do perfil do usuário atual
   * @returns {Promise<Object>} Os dados do perfil do usuário
   */
  getProfile: async () => {
    try {
      console.log('📱 A buscar dados do perfil...');
      
      const response = await apiClient.get('/api/perfil/get-perfil');
      
      console.log('📱 Dados do perfil recebidos:', response.data);
      
      // Atualizar alguns dados do usuário em cache
      const currentUser = await AsyncStorage.getItem('user');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        const updatedUserData = {
          ...userData,
          email: response.data.email,
          nome: response.data.nome,
          empresa_nome: response.data.empresa_nome
        };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar perfil:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar dados do perfil');
    }
  },
  
  /**
   * Atualiza os dados do perfil do usuário
   * @param {Object} profileData - Dados do perfil a serem atualizados
   * @returns {Promise<Object>} Os dados atualizados do perfil
   */
  updateProfile: async (profileData) => {
    try {
      console.log('📱 A atualizar dados do perfil:', profileData);
      
      const response = await apiClient.post('/api/perfil/atualizar-perfil', profileData);
      
      console.log('📱 Perfil atualizado com sucesso:', response.data);
      
      // Se a atualização foi bem-sucedida, atualizar os dados em cache
      if (response.data.success) {
        const currentUser = await AsyncStorage.getItem('user');
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          const updatedUserData = {
            ...userData,
            ...response.data.user
          };
          await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      throw new Error(error.response?.data?.message || 'Erro ao atualizar perfil');
    }
  }
};

export default profileService;
