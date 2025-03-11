import { StyleSheet, ScrollView, Dimensions, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState } from 'react';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Mock data based on your database structure
const mockRobots = [
  {
    id: 2,
    nome_robo: 'RoboX',
    identificador: 'RX-1234567',
    estado: 'Manutenção',
    temperatura: 45.2,
    ultima_atualizacao: '2025-03-11 13:04:07',
    endereco: '192.168.1.101',
    tempo_desmolde: 2.5,
    tempo_ciclo: 0,
    disponibilidade: 98.5,
    pecas_produzidas: 1250,
    pecas_rejeitadas: 5,
    amostras: 100,
    energia_consumida: 120.5,
    alarmes_ativos: 0,
    empresa_id: 3
  },
  {
    id: 3,
    nome_robo: 'NEO70',
    identificador: 'NEO-1234567',
    estado: 'Pronto',
    temperatura: 21.00,
    ultima_atualizacao: '2025-03-10 17:55:07',
    endereco: '192.168.1.102',
    tempo_desmolde: 0,
    tempo_ciclo: 0,
    disponibilidade: 96,
    pecas_produzidas: 26074,
    pecas_rejeitadas: 0.5,
    amostras: 19727,
    energia_consumida: 6708.42,
    alarmes_ativos: 0,
    empresa_id: 4
  }
];

const { width } = Dimensions.get('window');

interface Robot {
  id: number;
  nome_robo: string;
  identificador: string;
  estado: string;
  temperatura: number;
  ultima_atualizacao: string;
  endereco: string;
  tempo_desmolde: number;
  tempo_ciclo: number;
  disponibilidade: number;
  pecas_produzidas: number;
  pecas_rejeitadas: number;
  amostras: number;
  energia_consumida: number;
  alarmes_ativos: number;
  empresa_id: number;
}

interface RobotCardProps {
  robot: Robot;
  index: number;
}

const RobotCard = ({ robot, index }: RobotCardProps) => {
  const getStatusColor = (estado: string): string => {
    switch (estado) {
      case 'Pronto':
        return '#4CAF50';
      case 'Em Uso':
        return '#2196F3';
      case 'Erro':
        return '#f44336';
      case 'Manutenção':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 200)}
      style={styles.cardContainer}
    >
      <TouchableOpacity
        style={[styles.card, { borderLeftColor: getStatusColor(robot.estado) }]}
        onPress={() => router.push(`/robot/${robot.id}` as any)}
      >
        <View style={styles.cardHeader}>
          <ThemedText style={styles.robotName}>{robot.nome_robo}</ThemedText>
          <ThemedView style={[styles.statusBadge, { backgroundColor: getStatusColor(robot.estado) }]}>
            <ThemedText style={styles.statusText}>{robot.estado}</ThemedText>
          </ThemedView>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.metric}>
            <IconSymbol name="thermometer" size={20} color="#666" />
            <ThemedText style={styles.metricText}>{robot.temperatura}°C</ThemedText>
          </View>

          <View style={styles.metric}>
            <IconSymbol name="chart.line.uptrend.xyaxis" size={20} color="#666" />
            <ThemedText style={styles.metricText}>{robot.disponibilidade}%</ThemedText>
          </View>

          <View style={styles.metric}>
            <IconSymbol name="cube.box" size={20} color="#666" />
            <ThemedText style={styles.metricText}>{robot.pecas_produzidas}</ThemedText>
          </View>

          <View style={styles.metric}>
            <IconSymbol name="bolt" size={20} color="#666" />
            <ThemedText style={styles.metricText}>{robot.energia_consumida} kWh</ThemedText>
          </View>

          {robot.alarmes_ativos > 0 && (
            <View style={styles.alarmBadge}>
              <IconSymbol name="exclamationmark.triangle" size={16} color="#fff" />
              <ThemedText style={styles.alarmText}>{robot.alarmes_ativos}</ThemedText>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          <ThemedText style={styles.idText}>ID: {robot.identificador}</ThemedText>
          <ThemedText style={styles.updateText}>
            Última atualização: {new Date(robot.ultima_atualizacao).toLocaleTimeString()}
          </ThemedText>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function DashboardScreen() {
  const [robots] = useState(mockRobots);

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

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol name="checkmark.circle" size={24} color="#4CAF50" />
            <ThemedText style={styles.statNumber}>
              {robots.filter(r => r.estado === 'Pronto').length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Ativos</ThemedText>
          </View>

          <View style={styles.statCard}>
            <IconSymbol name="exclamationmark.triangle" size={24} color="#f44336" />
            <ThemedText style={styles.statNumber}>
              {robots.reduce((sum, r) => sum + r.alarmes_ativos, 0)}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Alarmes</ThemedText>
          </View>

          <View style={styles.statCard}>
            <IconSymbol name="gear" size={24} color="#FF9800" />
            <ThemedText style={styles.statNumber}>
              {robots.filter(r => r.estado === 'Manutenção').length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Manutenção</ThemedText>
          </View>
        </View>

        {robots.map((robot, index) => (
          <RobotCard key={robot.id} robot={robot} index={index} />
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
