import React from 'react'
import {
    Appearance,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native'

import Header from './UI/Header'
import Colors from './UI/Colors'
import TweetRow from './UI/TweetRow'
import AppearanceManager from './UI/AppearanceManager'


type PropsType = unknown

type StateType = {
    isDarkMode: boolean
}

class App extends React.Component<PropsType, StateType> {
    state = {
        isDarkMode: Appearance.getColorScheme() === 'dark'
    }

    backgroundStyle = {
        backgroundColor: this.state.isDarkMode ? Colors.darker : Colors.lighter,
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

    constructor(props: unknown) {
        super(props)
        this.appearanceChangeHandler = this.appearanceChangeHandler.bind(this)
    }

    appearanceChangeHandler(manager: AppearanceManager): void {
        this.setState(() => {
            return { isDarkMode: manager.state.colorScheme === 'dark' }
        })
    }
    
    render(): JSX.Element {
        const backgroundStyle = this.backgroundStyle
        const isDarkMode = this.state.isDarkMode
        return (
            <>
                <AppearanceManager handler={this.appearanceChangeHandler} />
                <SafeAreaView style={backgroundStyle}>
                    <StatusBar
                        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                    />
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={backgroundStyle}>
                        <Header headerTitle="React Tweet Gettr" />
                        <View
                            style={{
                                backgroundColor: isDarkMode
                                    ? Colors.black
                                    : Colors.white,
                            }}>
                            <TweetRow author="@bob_smith" isDarkMode={isDarkMode}>
                                "My pithy comments"
                            </TweetRow>
                            <TweetRow author="@bob_smith" isDarkMode={isDarkMode}>
                                "My salubrious comments"
                            </TweetRow>
                            <TweetRow author="@bob_smith" isDarkMode={isDarkMode}>
                                "My random comments"
                            </TweetRow>
                            <TweetRow author="@bob_smith" isDarkMode={isDarkMode}>
                                "My instapundit comments"
                            </TweetRow>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        )
    }
}

export default App
