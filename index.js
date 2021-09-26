/**
 * @format
 */

import { Navigation } from 'react-native-navigation'
import HomeScreen from './src/HomeScreen'
import SettingsScreen from './src/SettingsScreen'

Navigation.registerComponent('Home', () => HomeScreen)
Navigation.registerComponent('Settings', () => SettingsScreen)

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            bottomTabs: {
                children: [
                    {
                        stack: {
                            children: [
                                {
                                    component: {
                                        name: 'Home',
                                    },
                                },
                            ],
                        },            
                    },
                    {
                        stack: {
                            children: [
                                {
                                    component: {
                                        name: 'Settings',
                                    },
                                },
                            ],
                        },            
                    }
                ]
            }
        },
    })
})
