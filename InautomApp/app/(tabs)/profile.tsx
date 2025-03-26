import { StyleSheet, View, TouchableOpacity, ScrollView, Image, Dimensions, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import profileService from '@/services/api/profileService';
import authService from '@/services/api/authService';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const profileData = await profileService.getProfile();
      
      // Transformar os dados da API para o formato esperado pelo componente
      const formattedData = {
        id: profileData.id,
        username: profileData.username,
        name: profileData.nome || profileData.username,
        email: profileData.email,
        company: profileData.empresa_nome,
        empresa_id: profileData.empresa_id,
        lastAccess: profileData.ultimo_acesso ? 
          new Date(profileData.ultimo_acesso * 1000).toLocaleString('pt-PT') : 
          new Date(profileData.data_criacao * 1000).toLocaleString('pt-PT'),
        // Mantemos apenas os campos presentes na API
      };
      
      setUserData(formattedData);
      setEditData({
        username: profileData.username,
        email: profileData.email,
        password: '',
        confirmPassword: '',
      });
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setModalVisible(true);
  };

  const handleSaveProfile = async () => {
    try {
      // Validações básicas
      if (editData.password !== editData.confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem');
        return;
      }

      setUpdateLoading(true);

      // Criar objeto com dados a atualizar
      const updateData = {
        username: editData.username,
        email: editData.email,
      };

      // Adicionar senha apenas se foi preenchida
      if (editData.password) {
        updateData.password = editData.password;
      }

      // Chamar API para atualizar perfil
      const result = await profileService.updateProfile(updateData);
      
      if (result.success) {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso');
        setModalVisible(false);
        loadProfileData(); // Recarregar dados do perfil
      } else {
        Alert.alert('Erro', result.message || 'Erro ao atualizar perfil');
      }
    } catch (err) {
      Alert.alert('Erro', err.message || 'Erro ao atualizar perfil');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    router.replace('/login');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E31E24" />
        <ThemedText style={styles.loadingText}>A carregar perfil...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <IconSymbol name="exclamationmark.triangle" size={48} color="#E31E24" />
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={loadProfileData}>
          <ThemedText style={styles.retryText}>Tentar Novamente</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <ThemedView style={styles.header}>
          <View style={styles.headerBackground}>
            <View style={styles.circuitLine} />
            <View style={styles.circuitDot} />
            <View style={[styles.circuitLine, styles.circuitLineRight]} />
          </View>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <IconSymbol name="pencil" size={20} color="#fff" />
          </TouchableOpacity>
          
          <Animated.View 
            entering={FadeInDown.delay(200)}
            style={styles.profileImageContainer}
          >
            <View style={styles.profileImageBorder}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.profileImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.statusIndicator} />
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400)}
            style={styles.profileInfo}
          >
            <ThemedText style={styles.name}>{userData.name}</ThemedText>
            <ThemedText style={styles.company}>{userData.company}</ThemedText>
          </Animated.View>
        </ThemedView>

        <Animated.View 
          entering={FadeInDown.delay(800)}
          style={styles.section}
        >
          <ThemedText style={styles.sectionTitle}>Informações de Conta</ThemedText>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <IconSymbol name="person" size={20} color="#666" />
              <ThemedText style={styles.infoText}>Username: {userData.username}</ThemedText>
            </View>
            
            <View style={styles.infoRow}>
              <IconSymbol name="envelope" size={20} color="#666" />
              <ThemedText style={styles.infoText}>Email: {userData.email}</ThemedText>
            </View>
            
            <View style={styles.infoRow}>
              <IconSymbol name="building.2" size={20} color="#666" />
              <ThemedText style={styles.infoText}>Empresa: {userData.company}</ThemedText>
            </View>

            <View style={styles.infoRow}>
              <IconSymbol name="clock" size={20} color="#666" />
              <ThemedText style={styles.infoText}>Último acesso: {userData.lastAccess}</ThemedText>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(1000)}
          style={styles.section}
        >
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <IconSymbol name="power" size={20} color="#fff" />
            <ThemedText style={styles.logoutText}>Terminar Sessão</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Modal de Edição de Perfil */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Editar Perfil</ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <IconSymbol name="xmark" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Username</ThemedText>
              <TextInput
                style={styles.input}
                value={editData.username}
                onChangeText={(text) => setEditData({...editData, username: text})}
                placeholder="Username"
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                style={styles.input}
                value={editData.email}
                onChangeText={(text) => setEditData({...editData, email: text})}
                placeholder="Email"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Nova Senha (deixe em branco para não alterar)</ThemedText>
              <TextInput
                style={styles.input}
                value={editData.password}
                onChangeText={(text) => setEditData({...editData, password: text})}
                placeholder="Nova Senha"
                secureTextEntry
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Confirmar Senha</ThemedText>
              <TextInput
                style={styles.input}
                value={editData.confirmPassword}
                onChangeText={(text) => setEditData({...editData, confirmPassword: text})}
                placeholder="Confirmar Senha"
                secureTextEntry
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <ThemedText style={styles.buttonText}>Guardar</ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#E31E24',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    height: 260,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerBackground: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(227, 30, 36, 0.8)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  circuitLine: {
    width: width * 0.2,
    height: 2,
    backgroundColor: 'rgba(227, 30, 36, 0.5)',
  },
  circuitLineRight: {
    backgroundColor: 'rgba(227, 30, 36, 0.3)',
  },
  circuitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E31E24',
    marginHorizontal: 4,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImageBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#E31E24',
    padding: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: '80%',
    height: '80%',
    borderRadius: 50,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#fff',
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: '#E31E24',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: '#E31E24',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  
  // Estilos para o modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#E31E24',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
