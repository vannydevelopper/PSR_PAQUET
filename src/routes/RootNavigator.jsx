import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import BottomTabBar from '../components/app/BottomTabBar';
import HomeNavigator from './HomeNavigator';
import { Host } from 'react-native-portalize';
import PermisNavigator from './PermisNavigator';
import ProfilScreen from '../screens/ProfilScreen';

export default function RootNavigator() {

    const BottomTab = createBottomTabNavigator()
    return (
        <View style={styles.container}>
            <Host>
                <BottomTab.Navigator initialRouteName="Home" tabBar={props => <BottomTabBar {...props} />} screenOptions={{ headerShown: false }}>
                    <BottomTab.Screen name="HomeTab" component={HomeNavigator} />
                    <BottomTab.Screen name="PermisTab" component={PermisNavigator} />
                    <BottomTab.Screen name="ProfilTab" component={ProfilScreen} />
                </BottomTab.Navigator>
            </Host>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
