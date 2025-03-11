import { StyleSheet, View, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const mockUserData = {
  name: 'Artur Jesus',
  role: 'Desenvolvimento Software',
  company: 'Inautom Robótica & Automação',
  email: 'artur.jesus@inautom.com',
  phone: '+351 912 345 678',
  location: 'Leiria, Portugal',
  lastAccess: '14-03-2025 14:30',
  stats: {
    robotsMonitored: 12,
    alarmsResolved: 45,
    uptime: '98.5%'
  }
};

export default function ProfileScreen() {
  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <View style={styles.headerBackground}>
          <View style={styles.circuitLine} />
          <View style={styles.circuitDot} />
          <View style={[styles.circuitLine, styles.circuitLineRight]} />
        </View>
        
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
          <ThemedText style={styles.name}>{mockUserData.name}</ThemedText>
          <ThemedText style={styles.role}>{mockUserData.role}</ThemedText>
          <ThemedText style={styles.company}>{mockUserData.company}</ThemedText>
        </Animated.View>
      </ThemedView>

      <Animated.View 
        entering={FadeInDown.delay(600)}
        style={styles.statsContainer}
      >
        <View style={styles.statCard}>
          <IconSymbol name="cpu" size={24} color="#E31E24" />
          <ThemedText style={styles.statNumber}>{mockUserData.stats.robotsMonitored}</ThemedText>
          <ThemedText style={styles.statLabel}>Robôs</ThemedText>
        </View>

        <View style={styles.statCard}>
          <IconSymbol name="checkmark.shield" size={24} color="#E31E24" />
          <ThemedText style={styles.statNumber}>{mockUserData.stats.alarmsResolved}</ThemedText>
          <ThemedText style={styles.statLabel}>Alarmes</ThemedText>
        </View>

        <View style={styles.statCard}>
          <IconSymbol name="chart.bar" size={24} color="#E31E24" />
          <ThemedText style={styles.statNumber}>{mockUserData.stats.uptime}</ThemedText>
          <ThemedText style={styles.statLabel}>Uptime</ThemedText>
        </View>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(800)}
        style={styles.section}
      >
        <ThemedText style={styles.sectionTitle}>Informações de Contato</ThemedText>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <IconSymbol name="envelope" size={20} color="#666" />
            <ThemedText style={styles.infoText}>{mockUserData.email}</ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <IconSymbol name="phone" size={20} color="#666" />
            <ThemedText style={styles.infoText}>{mockUserData.phone}</ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <IconSymbol name="location" size={20} color="#666" />
            <ThemedText style={styles.infoText}>{mockUserData.location}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <IconSymbol name="clock" size={20} color="#666" />
            <ThemedText style={styles.infoText}>Último acesso: {mockUserData.lastAccess}</ThemedText>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  role: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    color: '#E31E24',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: -30,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 64) / 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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
}); 