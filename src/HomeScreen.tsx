import React, { ErrorInfo } from 'react'
import {
    Navigation,
    NavigationComponent,
    NavigationComponentProps,
    Options,
} from 'react-native-navigation'
import { Appearance, SafeAreaView, StyleSheet, Text, View } from 'react-native'

import Colors from './UI/Colors'
import AppearanceManager from './UI/AppearanceManager'

import ErrorData from './Types/ErrorData'
import TweetsList from './UI/TweetsList'
import { SelectHandler } from './UI/TweetRow';

type PropsType = NavigationComponentProps

type StateType = {
    isDarkMode: boolean
    hasError: boolean
    errMessage: string
}

class HomeScreen extends NavigationComponent<PropsType, StateType> {
    state = {
        isDarkMode: Appearance.getColorScheme() === 'dark',
        hasError: false,
        errMessage: ''
    }

    public static getDerivedStateFromError(err: Error): StateType {
        // Update state so the next render will show the fallback UI.
        const updatedState = {
            isDarkMode: Appearance.getColorScheme() === 'dark',
            hasError: true,
            errMessage: `${err.name}: ${err.message}`,
            tweets: []
        }
        return updatedState
    }

    public componentDidMount(): void {
        console.log("Home screen mount")
    }

    componentWillUnmount(): void {
        console.log("Home screen unmount")
    }

    /** Will catch all uncaught exceptions in the tree below it. */
    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Uncaught error:', error, errorInfo)
    }

    // Use arrow function here for hanlder to get "free" binding
    appearanceChangeHandler = (manager: AppearanceManager): void => {
        this.setState(prevState => {
            return {
                ...prevState,
                isDarkMode: manager.state.colorScheme === 'dark',
            }
        })
    }

    showDetail: SelectHandler = (tweetIx) => {
        console.log(tweetIx)
        Navigation.push(this.props.componentId, {
            component: {
                name: 'DetailScreen', 
                passProps: {
                    tweetIndex: tweetIx
                },
                options: { // Optional options object to configure the screen
                  topBar: {
                    title: {
                      text: 'Tweet Detail' // Set the TopBar title of the new Screen
                    }
                  }
                }
              }
        })
    }

    render(): JSX.Element {
        const isDk = this.state.isDarkMode
        const backgroundStyle = {
            backgroundColor: isDk ? Colors.darker : Colors.lighter,
        }
        const textStyle = isDk
            ? this.lightText.textColor
            : this.darkText.textColor

        const routineView = (
            <>
                <AppearanceManager handler={this.appearanceChangeHandler} />
                <SafeAreaView style={backgroundStyle}>
                    <TweetsList showDetailHandler={ this.showDetail } isDarkMode={isDk} />
                </SafeAreaView>
            </>
        )

        const errorView = (
            <View style={backgroundStyle}>
                <Text style={[this.styles.sectionTitle, textStyle]}>
                    Sorry, something went wrong. :-(
                </Text>
                <Text style={[this.styles.sectionDescription, textStyle]}>
                    {this.state.errMessage}
                </Text>
            </View>
        )
        return this.state.hasError ? errorView : routineView
    }

    styles = StyleSheet.create({
        sectionContainer: {
            marginTop: 32,
            paddingHorizontal: 24,
        },
        sectionTitle: {
            fontSize: 24,
            fontWeight: '600',
        },
        sectionDescription: {
            marginTop: 8,
            fontSize: 18,
            fontWeight: '400',
        },
        highlight: {
            fontWeight: '700',
        },
    })

    lightText = StyleSheet.create({
        textColor: {
            color: Colors.lighter,
        },
    })

    darkText = StyleSheet.create({
        textColor: {
            color: Colors.darker,
        },
    })

    static options: Options = {
        topBar: {
            title: {
                text: 'Tweets',
            },
        },
        bottomTab: {
            text: 'Home',
            iconColor: Colors.dark,
            textColor: Colors.dark,
            selectedTextColor: Colors.primary,
            selectedIconColor: Colors.primary,
            icon: {
                system: 'house.fill',
                fallback: require('./Icons/home-solid.png'),
            },
        },
    }
}

export default HomeScreen
