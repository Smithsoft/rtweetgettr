import React from 'react'
import {
    Appearance,
    FlatList,
    ListRenderItem,
    ListRenderItemInfo,
    Pressable,
    SafeAreaView,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    StatusBar,
    StyleSheet,
} from 'react-native'

import Header from './UI/Header'
import Colors from './UI/Colors'
import TweetRow from './UI/TweetRow'
import AppearanceManager from './UI/AppearanceManager'
import Tweet from './Model/Tweet'
import { Source } from 'react-native-fast-image'

type PropsType = unknown

type StateType = {
    isDarkMode: boolean
}

type LayoutParams = {
    length: number
    offset: number
    index: number
}

const ITEM_HEIGHT = 44

class App extends React.PureComponent<PropsType, StateType> {
    state = {
        isDarkMode: Appearance.getColorScheme() === 'dark',
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
        this.itemRenderHandler = this.itemRenderHandler.bind(this)
    }

    appearanceChangeHandler(manager: AppearanceManager): void {
        this.setState(() => {
            return { isDarkMode: manager.state.colorScheme === 'dark' }
        })
    }

    itemRenderHandler({ item }: ListRenderItemInfo<Tweet>): React.ReactElement {
        const auth_token = 'abcd'
        const picSource: Source = {
            uri: '',
            headers: {
                Authorization: `Bearer ${auth_token}`,
            },
        }
        return (
            <TweetRow
                tweet={item}
                isDarkMode={this.state.isDarkMode}
                profilePic={picSource}
            />
        )
    }

    keyExtractor( item : Tweet ): string {
        return `${item.id}`
    }

    itemLayout(data: Tweet[] | null | undefined, index:number): LayoutParams {
        return {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
    }

    render(): JSX.Element {
        const isDarkMode = this.state.isDarkMode
        const backgroundStyle = {
            backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        }
        const tw1: Tweet = {
            id: 737517909140856833,
            text: 'My tweet',
            createdAt: new Date(),
            name: 'Roger',
            screenName: 'Roger ramjet',
            userImage: 'placeholder',
            profileImageURL: '',
            biggerProfileImageURL: '',
        }
        const tw2: Tweet = {
            id: 737517909140856834,
            text: 'My tweet',
            createdAt: new Date(),
            name: 'Roger',
            screenName: 'Wily coyote',
            userImage: 'placeholder',
            profileImageURL: '',
            biggerProfileImageURL: '',
        }
        const tw3: Tweet = {
            id: 737517909140856835,
            text: 'My tweet',
            createdAt: new Date(),
            name: 'Roger',
            screenName: 'Roger ramjet',
            userImage: 'placeholder',
            profileImageURL: '',
            biggerProfileImageURL: '',
        }
        const tweets = [ tw1, tw2, tw3 ]
        const listHeaderComponent = (
            <Header headerTitle="RTweetGettr" />
        )
        // Don't use arrow functions in Flatlist - performance issues otherwise
        // https://codingislove.com/optimize-react-native-flatlist-performance/
        //
        // Can avoid
        console.log(`######## rendering - darkMode: ${this.state.isDarkMode}`)
        return (
            <>
                <AppearanceManager handler={this.appearanceChangeHandler} />
                <SafeAreaView style={backgroundStyle}>
                    <StatusBar
                        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                    />
                    <FlatList
                        ListHeaderComponent={listHeaderComponent}
                        data={tweets}
                        renderItem={this.itemRenderHandler}
                        style={backgroundStyle}
                        removeClippedSubviews={true}
                        getItemLayout={this.itemLayoutHandler}
                        keyExtractor={this.keyExtractorHandler}
                    />
                </SafeAreaView>
            </>
        )
    }
}

export default App
