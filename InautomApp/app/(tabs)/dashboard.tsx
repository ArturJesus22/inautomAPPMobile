import { StyleSheet, ScrollView, Dimensions, TouchableOpacity, View, SafeAreaView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getRobots, getRobotStats } from '../../services/api/robotService';

const { width } = Dimensions.get('window');

// Atualizando a interface para corresponder ao modelo do backend
interface Robot {
  ID: number;
  Modelo: string;
  SN: string;
  Estado: number; // 0-PARADO 1-MANUAL 2-AUTO
  IN_Error: number;
  PRG_Run: number;
  IP: string;
  Aviso_Manutencao: number;
  Contador_Ciclos_Geral: number;
  Ultima_Atualizacao: string;
  Empresa_ID: number;
  // Outros campos que possam existir no seu modelo
}

interface RobotStats {
  total: number;
  em_erro: number;
  em_ciclo: number;
  manutencao_pendente: number;
  status_distribution: {
    parado: number;
    manual: number;
    auto: number;
  };
}

interface RobotCardProps {
  robot: Robot;
  index: number;
}

const RobotCard = ({ robot, index }: RobotCardProps) => {
  const getStatusColor = (estado: number): string => {
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

  const getStatusText = (estado: number): string => {
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

  return (
      <Animated.View
          entering={FadeInDown.delay(index * 200)}
          style={styles.cardContainer}
      >
        <TouchableOpacity
            style={[styles.card, { borderLeftColor: getStatusColor(robot.Estado) }]}
            onPress={() => router.push(`/robot/${robot.ID}` as any)}
        >
          <View style={styles.cardHeader}>
            <ThemedText style={styles.robotName}>{robot.Modelo}</ThemedText>
            <ThemedView style={[styles.statusBadge, { backgroundColor: getStatusColor(robot.Estado) }]}>
              <ThemedText style={styles.statusText}>{getStatusText(robot.Estado)}</ThemedText>
            </ThemedView>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.metric}>
              <IconSymbol name="thermometer" size={20} color="#666" />
              <ThemedText style={styles.metricText}>--°C</ThemedText>
            </View>

            <View style={styles.metric}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={20} color="#666" />
              <ThemedText style={styles.metricText}>--% Disp.</ThemedText>
            </View>

            <View style={styles.metric}>
              <IconSymbol name="cube.box" size={20} color="#666" />
              <ThemedText style={styles.metricText}>{robot.Contador_Ciclos_Geral || 0} peças</ThemedText>
            </View>

            <View style={styles.metric}>
              <IconSymbol name="bolt" size={20} color="#666" />
              <ThemedText style={styles.metricText}>-- kWh</ThemedText>
            </View>

            {robot.IN_Error > 0 && (
                <View style={styles.alarmBadge}>
                  <IconSymbol name="exclamationmark.triangle" size={16} color="#fff" />
                  <ThemedText style={styles.alarmText}>{robot.IN_Error}</ThemedText>
                </View>
            )}
          </View>

          <View style={styles.cardFooter}>
            <ThemedText style={styles.idText}>SN: {robot.SN}</ThemedText>
            <ThemedText style={styles.updateText}>
              Última atualização: {new Date(robot.Ultima_Atualizacao).toLocaleTimeString()}
            </ThemedText>
          </View>
        </TouchableOpacity>
      </Animated.View>
  );
};

export default function DashboardScreen() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [stats, setStats] = useState<RobotStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Buscar dados dos robôs
        const robotsData = await getRobots();
        setRobots(robotsData);

        // Buscar estatísticas
        const statsData = await getRobotStats();
        setStats(statsData);

        setError(null);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Falha ao carregar dados. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <ThemedText style={styles.loadingText}>Carregando dados...</ThemedText>
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
                  getRobots()
                      .then(data => {
                        setRobots(data);
                        return getRobotStats();
                      })
                      .then(data => {
                        setStats(data);
                        setLoading(false);
                      })
                      .catch(err => {
                        console.error(err);
                        setError('Falha ao carregar dados. Tente novamente.');
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

  return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <View style={styles.topBarContent}>
            <IconSymbol name="chevron.left" size={20} color="#333" />
          </View>
        </View>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <ThemedView style={styles.header}>
            <ThemedText style={styles.title}>Dashboard</ThemedText>
            <ThemedText style={styles.subtitle}>Monitoramento de Robôs</ThemedText>
          </ThemedView>

          {stats && (
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <IconSymbol name="checkmark.circle" size={24} color="#4CAF50" />
                  <ThemedText style={styles.statNumber}>
                    {stats.status_distribution.auto}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Ativos</ThemedText>
                </View>

                <View style={styles.statCard}>
                  <IconSymbol name="exclamationmark.triangle" size={24} color="#f44336" />
                  <ThemedText style={styles.statNumber}>
                    {stats.em_erro}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Em Erro</ThemedText>
                </View>

                <View style={styles.statCard}>
                  <IconSymbol name="gear" size={24} color="#FF9800" />
                  <ThemedText style={styles.statNumber}>
                    {stats.manutencao_pendente}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Manutenção</ThemedText>
                </View>
              </View>
          )}

          {robots.map((robot, index) => (
              <RobotCard key={robot.ID} robot={robot} index={index} />
          ))}
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
  topBar: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 0,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 48) / 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  robotName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  cardContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  metricText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  alarmBadge: {
    position: 'absolute',
    top: -20,
    right: -20,
    backgroundColor: '#f44336',
    borderRadius: 12,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alarmText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  idText: {
    fontSize: 12,
    color: '#666',
  },
  updateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
