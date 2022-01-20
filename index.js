/**
 * @format
 */

import { Navigation } from 'react-native-navigation'
import DetailScreen from './src/DetailScreen'
import HomeScreen from './src/HomeScreen'
import SettingsScreen from './src/SettingsScreen'

// Navigation.setDefaultOptions({
//     statusBar: {
//       backgroundColor: '#4d089a'
//     },
//     topBar: {
//       title: {
//         color: 'white'
//       },
//       backButton: {
//         color: 'white'
//       },
//       background: {
//         color: '#4d089a'
//       }
//     }
//   })

Navigation.registerComponent('Home', () => HomeScreen)
Navigation.registerComponent('Settings', () => SettingsScreen)
Navigation.registerComponent('DetailScreen', () => DetailScreen)

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
