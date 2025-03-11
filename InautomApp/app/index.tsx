import {
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    Easing,
    withSpring,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
    const rotation = useSharedValue(0);
    const pulseValue = useSharedValue(1);
    const circleScale = useSharedValue(1);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 8000,
                easing: Easing.linear,
            }),
            -1,
            false
        );

        pulseValue.value = withRepeat(
            withTiming(1.2, {
                duration: 2000,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
        );

        circleScale.value = withRepeat(
            withSpring(1.2, {
                damping: 2,
                stiffness: 80,
            }),
            -1,
            true
        );
    }, []);

    const rotatingStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    const pulseStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: pulseValue.value }],
            opacity: interpolate(pulseValue.value, [1, 1.2], [0.8, 0.4]),
        };
    });

    const circleStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: circleScale.value }],
            opacity: interpolate(circleScale.value, [1, 1.2], [0.6, 0.2]),
        };
    });

    const handleLoginPress = () => {
        router.push('/login');
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.background} />

            {/* Animated Background Elements */}
            <Animated.View style={[styles.circleBackground, pulseStyle]} />
            <Animated.View style={[styles.circleBackground, circleStyle]} />

            {/* Logo Container with Rotating Gear */}
            <Animated.View
                entering={FadeInDown.delay(500).springify()}
                style={styles.logoContainer}
            >
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Animated.View style={[styles.gearIcon, rotatingStyle]}>
                    <IconSymbol name="gearshape" size={80} color="rgba(227, 30, 36, 0.3)" />
                </Animated.View>
                <View style={styles.gearIcon2}>
                    <IconSymbol name="gearshape.2" size={60} color="rgba(227, 30, 36, 0.2)" />
                </View>
            </Animated.View>

            <Animated.View
                entering={FadeInUp.delay(800).springify()}
                style={styles.contentContainer}
            >
                <ThemedText style={styles.welcomeText}>
                    Bem-vindo à Inautom
                </ThemedText>
                <ThemedText style={styles.subtitleText}>
                    Inovação em Automação Industrial{'\n'}
                    Tecnologia de Ponta em Robótica
                </ThemedText>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLoginPress}
                >
                    <View style={styles.buttonContent}>
                        <ThemedText style={styles.loginButtonText}>
                            Aceder ao Sistema
                        </ThemedText>
                        <IconSymbol name="arrow.right.circle.fill" size={24} color="white" style={styles.buttonIcon} />
                    </View>
                </TouchableOpacity>

                {/* Animated Circuit Lines */}
                <View style={styles.circuitLines}>
                    <View style={styles.circuitLine} />
                    <View style={styles.circuitDot} />
                    <View style={[styles.circuitLine, styles.circuitLineRight]} />
                </View>
            </Animated.View>

            <Animated.View
                entering={FadeInUp.delay(1000).springify()}
                style={styles.footerContainer}
            >
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <IconSymbol name="chart.bar.fill" size={24} color="#E31E24" />
                        <ThemedText style={styles.statNumber}>100%</ThemedText>
                        <ThemedText style={styles.statLabel}>Eficiência</ThemedText>
                    </View>
                    <View style={styles.statItem}>
                        <IconSymbol name="clock.fill" size={24} color="#E31E24" />
                        <ThemedText style={styles.statNumber}>24/7</ThemedText>
                        <ThemedText style={styles.statLabel}>Monitoramento</ThemedText>
                    </View>
                    <View style={styles.statItem}>
                        <IconSymbol name="checkmark.shield.fill" size={24} color="#E31E24" />
                        <ThemedText style={styles.statNumber}>100%</ThemedText>
                        <ThemedText style={styles.statLabel}>Segurança</ThemedText>
                    </View>
                </View>
            </Animated.View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#1a1a1a',
    },
    circleBackground: {
        position: 'absolute',
        width: height * 0.4,
        height: height * 0.4,
        borderRadius: height * 0.2,
        backgroundColor: 'rgba(227, 30, 36, 0.05)',
        top: -height * 0.1,
        right: -width * 0.2,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: height * 0.12,
        position: 'relative',
    },
    logo: {
        width: width * 0.7,
        height: height * 0.12,
        tintColor: 'white',
    },
    gearIcon: {
        position: 'absolute',
        right: width * 0.1,
        top: -20,
    },
    gearIcon2: {
        position: 'absolute',
        left: width * 0.15,
        bottom: -30,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        marginTop: height * 0.08,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
        includeFontPadding: false,
        lineHeight: 34,
    },
    subtitleText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginBottom: 50,
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    loginButton: {
        width: '80%',
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E31E24',
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#E31E24',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 10,
    },
    buttonIcon: {
        marginLeft: 8,
    },
    circuitLines: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        width: '100%',
        justifyContent: 'center',
    },
    circuitLine: {
        width: width * 0.2,
        height: 2,
        backgroundColor: 'rgba(227, 30, 36, 0.3)',
    },
    circuitLineRight: {
        backgroundColor: 'rgba(227, 30, 36, 0.15)',
    },
    circuitDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E31E24',
        marginHorizontal: 4,
    },
    footerContainer: {
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
    },
    statLabel: {
        color: '#999',
        fontSize: 12,
        marginTop: 4,
    },
}); 