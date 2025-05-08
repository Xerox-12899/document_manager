import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';

const Logo = () => {
    const colorAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Logo color animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(colorAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.timing(colorAnim, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: false,
                }),
            ])
        ).start();

        // Glow animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: false,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, [colorAnim, glowAnim]);

    const interpolatedColor = colorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#ff00ff', '#00ffff'],
    });

    const interpolatedGlowColors = glowAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['rgb(65, 54, 65)', 'rgb(232, 28, 28)', 'rgb(21, 86, 199)'],
    });
    return (
        <View style={styles.container}>
            <View style={styles.glowContainer}>
                <Animated.View
                    style={[styles.glowInner, { backgroundColor: interpolatedGlowColors }]}
                />
                <BlurView
                    style={styles.blurView}
                    blurType="light"
                    blurAmount={20}
                    reducedTransparencyFallbackColor="white"
                />
                <LinearGradient
                    colors={['rgba(255,255,255,0.1)', 'rgba(212, 245, 26, 0.4)', 'rgba(255,255,255,0.1)']}
                    style={styles.glowHighlight}
                />
            </View>
            <Animated.Image
                source={require('../assets/app_logo.png')}
                style={[styles.logo, { tintColor: interpolatedColor }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 250,
        marginVertical: 40,
    },
    logo: {
        width: 150,
        height: 150,
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 10,
    },
    glowContainer: {
        width: 200,
        height: 200,
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    glowInner: {
        width: 150,
        height: 150,
        borderRadius: 75,
        opacity: 0.8,
    },
    blurView: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        borderRadius: 100,
        overflow: 'hidden',
    },
    glowHighlight: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 100,
        opacity: 0.5,
        transform: [{ scaleX: 1.2 }],
    },
});

export default Logo;
