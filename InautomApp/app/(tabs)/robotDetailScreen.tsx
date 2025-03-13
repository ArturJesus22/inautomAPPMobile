import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getRobotDetails } from '../../services/api/robotService';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RobotDetailScreen() {
  const { id } = useLocalSearchParams();
  const [robot, setRobot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRobotDetails = async () => {
      try {
        setLoading(true);
        const data = await getRobotDetails(id);
        setRobot(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar detalhes do robô:', err);
        setError('Falha ao carregar detalhes do robô.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRobotDetails();
    }
  }, [id]);

  const getStatusColor = (estado) => {
    if (estado === undefined || estado === null) return '#757575';

    switch (estado) {
      case 0: // PARADO
        return '#757575';
      case 1: // MANUAL
        return '#2196F3';
      case 2: // AUTO
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  const getStatusText = (estado) => {
    if (estado === undefined || estado === null) return 'Desconhecido';

    switch (estado) {
      case 0:
        return 'Parado';
      case 1:
        return 'Manual';
      case 2:
        return 'Auto';
      default:
        return 'Desconhecido';
    }
  };

  if (loading) {
    return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <ThemedText style={styles.loadingText}>Carregando detalhes do robô...</ThemedText>
          </View>
        </SafeAreaView>
    );
  }

  if (error) {
    return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <IconSymbol name="exclamationmark.triangle" size={48} color="#f44336" />
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  setLoading(true);
                  setError(null);
                  getRobotDetails(id)
                      .then(data => {
                        setRobot(data);
                        setLoading(false);
                      })
                      .catch(err => {
                        console.error(err);
                        setError('Falha ao carregar detalhes do robô.');
                        setLoading(false);
                      });
                }}
            >
              <ThemedText style={styles.retryText}>Tentar Novamente</ThemedText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
    );
  }

  if (!robot) {
    return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>Robô não encontrado</ThemedText>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
              <ThemedText style={styles.backText}>Voltar</ThemedText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
    );
  }

  return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.topBarContent}>
            <IconSymbol name="chevron.left" size={20} color="#333" />
            <ThemedText style={styles.topBarText}>Voltar</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Animated.View entering={FadeInDown.delay(100)}>
            <ThemedView style={styles.header}>
              <ThemedText style={styles.title}>{robot.Modelo || 'Robô'}</ThemedText>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(robot.Estado) }]}>
                <ThemedText style={styles.statusText}>{getStatusText(robot.Estado)}</ThemedText>
              </View>
            </ThemedView>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)} style={styles.infoCard}>
            <ThemedText style={styles.sectionTitle}>Informações Básicas</ThemedText>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>ID:</ThemedText>
              <ThemedText style={styles.infoValue}>{robot.ID}</ThemedText>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Número de Série:</ThemedText>
              <ThemedText style={styles.infoValue}>{robot.SN || 'N/A'}</ThemedText>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Endereço IP:</ThemedText>
              <ThemedText style={styles.infoValue}>{robot.IP || 'N/A'}</ThemedText>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Versão do Software:</ThemedText>
              <ThemedText style={styles.infoValue}>{robot.Software_Version || 'N/A'}</ThemedText>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Última Atualização:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {robot.Ultima_Atualizacao ? new Date(robot.Ultima_Atualizacao).toLocaleString() : 'N/A'}
              </ThemedText>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)} style={styles.infoCard}>
            <ThemedText style={styles.sectionTitle}>Status Operacional</ThemedText>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Estado:</ThemedText>
              <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(robot.Estado) }]}>
                <ThemedText style={styles.statusIndicatorText}>{getStatusText(robot.Estado)}</ThemedText>
              </View>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Em Erro:</ThemedText>
              <View style={[styles.statusIndicator, {
                backgroundColor: robot.IN_Error ? '#f44336' : '#4CAF50'
              }]}>
                <ThemedText style={styles.statusIndicatorText}>
                  {robot.IN_Error ? 'Sim' : 'Não'}
                </ThemedText>
              </View>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Em Ciclo:</ThemedText>
              <View style={[styles.statusIndicator, {
                backgroundColor: robot.PRG_Run ? '#2196F3' : '#757575'
              }]}>
                <ThemedText style={styles.statusIndicatorText}>
                  {robot.PRG_Run ? 'Sim' : 'Não'}
                </ThemedText>
              </View>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Aviso de Manutenção:</ThemedText>
              <View style={[styles.statusIndicator, {
                backgroundColor: robot.Aviso_Manutencao ? '#FF9800' : '#4CAF50'
              }]}>
                <ThemedText style={styles.statusIndicatorText}>
                  {robot.Aviso_Manutencao ? 'Sim' : 'Não'}
                </ThemedText>
              </View>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Modo Eco:</ThemedText>
              <View style={[styles.statusIndicator, {
                backgroundColor: robot.Eco_Mode_On ? '#4CAF50' : '#757575'
              }]}>
                <ThemedText style={styles.statusIndicatorText}>
                  {robot.Eco_Mode_On ? 'Ativado' : 'Desativado'}
                </ThemedText>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)} style={styles.infoCard}>
            <ThemedText style={styles.sectionTitle}>Métricas de Produção</ThemedText>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Programa Ativo:</ThemedText>
              <ThemedText style={styles.infoValue}>{robot.Programa_Ativo || 'Nenhum'}</ThemedText>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Contador de Ciclos:</ThemedText>
              <ThemedText style={styles.infoValue}>{robot.Contador_Ciclos_Geral || '0'}</ThemedText>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Tempo IMM:</ThemedText>
              <ThemedText style={styles.infoValue}>{robot.Tempo_IMM ? `${robot.Tempo_IMM}s` : 'N/A'}</ThemedText>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Tempo do Robô:</ThemedText>
              <ThemedText style={styles.infoValue}>{robot.Tempo_Robo ? `${robot.Tempo_Robo}s` : 'N/A'}</ThemedText>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Tempo Dentro do Molde:</ThemedText>
              <ThemedText style={styles.infoValue}>{robot.Tempo_Dentro_Molde ? `${robot.Tempo_Dentro_Molde}s` : 'N/A'}</ThemedText>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#757575',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backText: {
    color: 'white',
    fontWeight: 'bold',
  },
  topBar: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  statusIndicatorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});
