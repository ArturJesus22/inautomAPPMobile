import React from 'react';
import {
    Image,
    StyleSheet,
    Dimensions,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ToastAndroid,
    Alert,
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
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import authService from '../services/api/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const showToast = (message: string) => {
    if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.LONG,
            ToastAndroid.CENTER
        );
    } else {
        Alert.alert('Aviso', message);
    }
};

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Animated values
    const rotation = useSharedValue(0);
    const scanLine = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 8000,
                easing: Easing.linear,
            }),
            -1,
            false
        );

        scanLine.value = withRepeat(
            withTiming(1, {
                duration: 2000,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
        );
    }, []);

    const rotatingStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const scanLineStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: interpolate(scanLine.value, [0, 1], [0, 200]) }],
        opacity: interpolate(scanLine.value, [0, 0.5, 1], [0, 0.5, 0]),
    }));

    const handleLogin = async () => {
        if (!email || !password) {
            showToast('Preencha todos os campos para continuar.');
            return;
        }

        setIsLoading(true);

        try {
            const userData = await authService.login(email, password);
            console.log('Usuário logado:', userData);
            router.replace('/(tabs)/dashboard');
        } catch (error) {
            showToast('Erro ao fazer login.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoid}
        >
            <ThemedView style={styles.container}>
                <View style={styles.background} />

                {/* Background Elements */}
                <View style={styles.circuitBackground} />
                <Animated.View style={[styles.scanLine, scanLineStyle]} />

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
                        <IconSymbol name="gearshape" size={60} color="rgba(227, 30, 36, 0.3)" />
                    </Animated.View>
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(800).springify()}
                    style={styles.contentContainer}
                >
                    <ThemedText style={styles.welcomeText}>
                        Acesso ao Sistema
                    </ThemedText>
                    <ThemedText style={styles.subtitleText}>
                        Entre com suas credenciais para continuar
                    </ThemedText>

                    <View style={styles.formContainer}>
                        <Animated.View
                            entering={FadeInUp.delay(1000).springify()}
                            style={styles.inputWrapper}
                        >
                            <View style={styles.inputContainer}>
                                <IconSymbol name="person.fill" size={20} color="#777" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Username"
                                    placeholderTextColor="#666"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <IconSymbol name="lock.fill" size={20} color="#777" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#666"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <IconSymbol
                                        name={showPassword ? "eye.slash.fill" : "eye.fill"}
                                        size={20}
                                        color="#777"
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.forgotPassword}>
                                <ThemedText style={styles.forgotPasswordText}>
                                    Esqueceu a password?
                                </ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.loginButton, isLoading && styles.loginButtonLoading]}
                                onPress={handleLogin}
                                disabled={isLoading}
                            >
                                <View style={styles.buttonContent}>
                                    {isLoading ? (
                                        <IconSymbol name="arrow.clockwise" size={24} color="white" style={rotatingStyle} />
                                    ) : (
                                        <>
                                            <ThemedText style={styles.loginButtonText}>
                                                Entrar
                                            </ThemedText>
                                            <IconSymbol name="arrow.right.circle.fill" size={24} color="white" />
                                        </>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                    <Animated.View
                        entering={FadeInUp.delay(1200).springify()}
                        style={styles.footerContainer}
                    >
                        <View style={styles.circuitLines}>
                            <View style={styles.circuitLine} />
                            <View style={styles.circuitDot} />
                            <View style={[styles.circuitLine, styles.circuitLineRight]} />
                        </View>
                        
                        <TouchableOpacity style={styles.supportButton}>
                            <IconSymbol name="headphones" size={20} color="#E31E24" />
                            <ThemedText style={styles.supportButtonText}>
                                Suporte Técnico
                            </ThemedText>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </ThemedView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoid: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#0a0a0a',
    },
    circuitBackground: {
        position: 'absolute',
        width: width,
        height: height,
        opacity: 0.08,
        backgroundColor: '#E31E24',
    },
    scanLine: {
        position: 'absolute',
        width: width,
        height: 2,
        backgroundColor: '#E31E24',
        opacity: 0.7,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: height * 0.08,
        position: 'relative',
    },
    logo: {
        width: width * 0.5,
        height: height * 0.08,
        tintColor: '#ffffff',
    },
    gearIcon: {
        position: 'absolute',
        right: -width * 0.1,
        top: -10,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        marginTop: height * 0.04,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 10,
        includeFontPadding: false,
        lineHeight: 34,
    },
    subtitleText: {
        fontSize: 16,
        color: '#cccccc',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    formContainer: {
        width: '100%',
    },
    inputWrapper: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(227, 30, 36, 0.3)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 15,
        marginBottom: 15,
        paddingHorizontal: 15,
        height: 55,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    inputIcon: {
        marginRight: 10,
        color: '#E31E24',
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#ffffff',
    },
    eyeIcon: {
        padding: 8,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 25,
    },
    forgotPasswordText: {
        color: '#ff4d4d',
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        height: 55,
        borderRadius: 15,
        backgroundColor: '#E31E24',
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#E31E24',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
    },
    loginButtonLoading: {
        opacity: 0.8,
    },
    buttonContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    footerContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 40,
    },
    circuitLines: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        marginBottom: 20,
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
    supportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'rgba(227, 30, 36, 0.1)',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(227, 30, 36, 0.3)',
    },
    supportButtonText: {
        color: '#ff4d4d',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
    },
}); 