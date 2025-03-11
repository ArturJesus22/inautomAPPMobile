import {
    Image,
    StyleSheet,
    Dimensions,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ToastAndroid,
    Alert
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

const showToast = (message) => {
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

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        if (!email || !password) {
            showToast('Preencha todos os campos para continuar.');
            return;
        }

        setIsLoading(true);

        // Simulação de login
        setTimeout(() => {
            setIsLoading(false);
            // Navegação para a tela principal após login bem-sucedido
            // router.replace('/dashboard');
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoid}
        >
            <ThemedView style={styles.container}>
                <Animated.View
                    entering={FadeIn.delay(200)}
                />

                <Animated.View
                    entering={FadeInDown.delay(500).springify()}
                    style={styles.logoContainer}
                >
                    <Image
                        source={require('@/assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(800).springify()}
                    style={styles.contentContainer}
                >
                    <ThemedText style={styles.welcomeText}>
                        Acesso Restrito
                    </ThemedText>
                    <ThemedText style={styles.subtitleText}>
                        Entre com suas credenciais para aceder
                    </ThemedText>

                    <Animated.View
                        entering={FadeInUp.delay(1000).springify()}
                        style={styles.formContainer}
                    >
                        <ThemedView style={styles.inputContainer}>
                            <IconSymbol name="envelope" size={20} color="#777" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </ThemedView>

                        <ThemedView style={styles.inputContainer}>
                            <IconSymbol name="lock" size={20} color="#777" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <IconSymbol
                                    name={showPassword ? "eye.slash" : "eye"}
                                    size={20}
                                    color="#777"
                                />
                            </TouchableOpacity>
                        </ThemedView>

                        <TouchableOpacity
                            style={styles.forgotPassword}
                        >
                            <ThemedText style={styles.forgotPasswordText}>
                                Esqueceu-se da password?
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            <ThemedText style={styles.loginButtonText}>
                                {isLoading ? "Entrando..." : "Entrar"}
                            </ThemedText>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInUp.delay(1300).springify()}
                        style={styles.footerContainer}
                    >
                        <ThemedText style={styles.footerText}>
                            Não tem uma conta? Entre em contacto com nosso suporte!
                        </ThemedText>

                        <TouchableOpacity style={styles.contactButton}>
                            <IconSymbol name="phone" size={16} color="#E31E24" />
                            <ThemedText style={styles.contactButtonText}>
                                Contactar Suporte
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
        backgroundColor: 'white',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: height * 0.1,
    },
    logo: {
        width: width * 0.7,
        height: height * 0.12,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        marginTop: height * 0.04,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitleText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        height: 55,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    inputIcon: {
        marginRight: 10,
    },
    eyeIcon: {
        padding: 8,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 25,
    },
    forgotPasswordText: {
        color: '#E31E24',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#E31E24',
        borderRadius: 10,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    footerText: {
        color: '#666',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    contactButtonText: {
        color: '#E31E24',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
});
