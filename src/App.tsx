import React, { ErrorInfo } from 'react'
import {
    Appearance,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native'

import Colors from './UI/Colors'
import AppearanceManager from './UI/AppearanceManager'
import TweetsList from './UI/TweetsList'

import { tweets } from './Model/FakeData'

type PropsType = unknown

type StateType = {
    isDarkMode: boolean
    hasError: boolean
    errMessage: string
}

class App extends React.PureComponent<PropsType, StateType> {
    state = {
        isDarkMode: Appearance.getColorScheme() === 'dark',
        hasError: false,
        errMessage: '',
    }

    constructor(props: PropsType) {
        super(props)
        this.appearanceChangeHandler = this.appearanceChangeHandler.bind(this)
    }

    public static getDerivedStateFromError(err: Error): StateType {
        // Update state so the next render will show the fallback UI.
        const updatedState = { 
            isDarkMode: Appearance.getColorScheme() === 'dark', 
            hasError: true, 
            errMessage: `${err.name}: ${err.message}` 
        }
        return updatedState
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Uncaught error:', error, errorInfo)
    }

    appearanceChangeHandler(manager: AppearanceManager): void {
        this.setState((prevState) => {
            return { ...prevState, isDarkMode: manager.state.colorScheme === 'dark' }
        })
    }

    render(): JSX.Element {
        const isDk = this.state.isDarkMode
        const backgroundStyle = {
            backgroundColor: isDk ? Colors.darker : Colors.lighter,
        }
        const textStyle = isDk ? this.lightText.textColor : this.darkText.textColor

        const routineView = (
            <>
                <AppearanceManager handler={this.appearanceChangeHandler} />
                <SafeAreaView style={backgroundStyle}>
                    <StatusBar
                        barStyle={isDk ? 'light-content' : 'dark-content'}
                    />
                    <TweetsList isDarkMode={isDk} tweetData={tweets} />
                </SafeAreaView>
            </>
        )

        const errorView = (
            <View style={backgroundStyle}>
                <Text style={[this.styles.sectionTitle, textStyle]}>Sorry, something went wrong. :-(</Text>
                <Text style={[this.styles.sectionDescription, textStyle]}>{this.state.errMessage}</Text>
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
            color: Colors.lighter
        }
    })

    darkText = StyleSheet.create({
        textColor: {
            color: Colors.darker
        }
    })
}

export default App
