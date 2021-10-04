import React, { ErrorInfo } from 'react'
import {
    NavigationComponent,
    NavigationComponentProps,
    Options,
} from 'react-native-navigation'
import { Appearance, SafeAreaView, StyleSheet, Text, View } from 'react-native'

import Colors from './UI/Colors'
import AppearanceManager from './UI/AppearanceManager'
import TweetsList from './UI/TweetsList'

import { tweets } from './Model/FakeData'
import Tweet from './Model/Tweet'
import { TwitterClient } from './Model/TwitterClient'
import ErrorData from './Types/ErrorData'
import { RequestId } from './Service/TwitterService'

import { DeviceEventEmitter } from 'react-native'

type PropsType = NavigationComponentProps

type StateType = {
    isDarkMode: boolean
    hasError: boolean
    errMessage: string
    tweets: Tweet[]
}

class HomeScreen extends NavigationComponent<PropsType, StateType> {
    state = {
        isDarkMode: Appearance.getColorScheme() === 'dark',
        hasError: false,
        errMessage: '',
        tweets: []
    }

    private _requests: RequestId[] = []

    constructor(props: PropsType) {
        super(props)
        this.appearanceChangeHandler = this.appearanceChangeHandler.bind(this)
        this.handleTweetUpdates = this.handleTweetUpdates.bind(this)
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

    handleTweetUpdates(tweets: Tweet[]): void {
        console.log("#################")
        console.log(tweets)
        this.setState((prevState) => { return { 
            ...prevState,
            tweets
        } })
    }

    handleError(error: ErrorData): void {
        console.log(error)
    }

    public componentDidMount(): void {
        console.log("Home screen mount")
        TwitterClient.subscribe('TWEETS', this.handleTweetUpdates)
        TwitterClient.subscribe('ERROR', this.handleError)
        TwitterClient.instance
            .setUserName("plistinator")
            .setToken("AAAAAzzzzAAAAAAAC20TQEAAAAAIGwoEgMI0VKMfZH2g56bYC7Eo3g%3D2Ryo0rTT1qXC565i6c0zn8MD7h2X3MmEg5PIXwbLDahgDjq1rs")
            .fetchTweetsForLoggedInUser()
    }

    componentWillUnmount(): void {
        console.log("Home screen unmount")
        TwitterClient.instance.cancelRequests(this._requests)
        this._requests = []
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Uncaught error:', error, errorInfo)
    }

    appearanceChangeHandler(manager: AppearanceManager): void {
        this.setState(prevState => {
            return {
                ...prevState,
                isDarkMode: manager.state.colorScheme === 'dark',
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

        console.log('######')
        console.log(JSON.stringify(tweets))
        console.log('######')

        const routineView = (
            <>
                <AppearanceManager handler={this.appearanceChangeHandler} />
                <SafeAreaView style={backgroundStyle}>
                    <TweetsList isDarkMode={isDk} tweetData={tweets} />
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
