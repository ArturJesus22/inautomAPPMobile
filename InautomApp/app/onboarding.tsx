import { StyleSheet, useWindowDimensions, Pressable, Image } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const onboardingSteps = [
  {
    title: 'Bem-vindo ao InautomMobile',
    description: 'Sua nova experiência em automação  começa aqui',
    showLogo: true
  },
  {
    title: 'Controle Total',
    description: 'Gerencie seus dispositivos de qualquer lugar, a qualquer momento',
    icon: 'wifi' as const
  },
  {
    title: 'Comece Agora',
    description: 'Pronto para começar sua jornada?',
    icon: 'rocket' as const
  }
];

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <ThemedView style={styles.container}>
      <Animated.View 
        entering={FadeIn}
        exiting={FadeOut}
        style={styles.content}
      >
        <ThemedView style={styles.iconContainer}>
          {onboardingSteps[currentStep].showLogo ? (
            <Image 
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <Ionicons 
              name={onboardingSteps[currentStep].icon} 
              size={150} 
              color="#E31E24"
            />
          )}
        </ThemedView>
        <ThemedView style={styles.textContainer}>
          <ThemedText type="title" style={styles.title}>
            {onboardingSteps[currentStep].title}
          </ThemedText>
          <ThemedText style={styles.description}>
            {onboardingSteps[currentStep].description}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.footer}>
          <ThemedView style={styles.pagination}>
            {onboardingSteps.map((_, index) => (
              <ThemedView
                key={index}
                style={[
                  styles.paginationDot,
                  currentStep === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </ThemedView>

          <AnimatedPressable
            style={styles.button}
            onPress={handleNext}
          >
            <ThemedText style={styles.buttonText}>
              {currentStep === onboardingSteps.length - 1 ? 'Começar' : 'Próximo'}
            </ThemedText>
          </AnimatedPressable>
        </ThemedView>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: '80%',
    height: 300,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: '#E31E24',
  },
  button: {
    backgroundColor: '#E31E24',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 