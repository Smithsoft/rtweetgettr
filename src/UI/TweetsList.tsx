import React from 'react'
import {
    Appearance,
    EmitterSubscription,
    FlatList,
    ListRenderItemInfo,
    RefreshControl,
    StyleSheet,
} from 'react-native'
import { Source } from 'react-native-fast-image'

import Tweet from '../Model/Tweet'
import { TwitterClient } from '../Model/TwitterClient'
import Colors from './Colors'
import Header from './RGHeader'
import TweetRow from './TweetRow'
import { tweets as tweetData } from '../Model/FakeData'
import { ITEM_HEIGHT } from './Dims'

import Config from 'react-native-config'
import { Dimensions } from 'react-native';


type LayoutParams = {
    length: number
    offset: number
    index: number
}

const itemLayout = (
    data: Tweet[] | null | undefined,
    index: number,
): LayoutParams => {
    return { length: Dimensions.get("screen").width, offset: ITEM_HEIGHT * index, index }
}

type PropsType = {
    isDarkMode: boolean
}

type StateType = {
    isDarkMode: boolean
    refreshing: boolean
    tweets: Tweet[]
}

class TweetsList extends React.PureComponent<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props)
        this.itemRenderHandler = this.itemRenderHandler.bind(this)
        this.onRefreshHandler = this.onRefreshHandler.bind(this)
        this.dataHandler = this.dataHandler.bind(this)
    }

    state = {
        isDarkMode: Appearance.getColorScheme() === 'dark',
        refreshing: false,
        tweets: tweetData
    }

    private _tweetsSubscription?: EmitterSubscription

    onScreenChangeHandler(): void {
        console.log("Do nothing for now")
    }

    onRefreshHandler(): void {
        this.setState((prevState) => {
            return {
                ...prevState,
                refreshing: true
            }
        }, () => {
            TwitterClient.instance.fetchTweetsForLoggedInUser()
        })
    }

    itemRenderHandler({ item }: ListRenderItemInfo<Tweet>): React.ReactElement {
        const auth_token = 'abcd'
        const picSource: Source = {
            uri: item.profileImageURL,
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

    dataHandler(tweetData: Tweet[]): void {
        this.setState((prevState, props) => {
            return {
                ...prevState,
                refreshing: false,
                tweets: tweetData
            }
        })
    }

    componentDidMount(): void {
        Dimensions.addEventListener("change", this.onScreenChangeHandler)
        const token = Config.BEARER_TOKEN
        const user = Config.USER_NAME
        console.log(`TweetsList mounting ######## - ${token} - ${user}`)
        this._tweetsSubscription = TwitterClient.subscribe('TWEETS', this.dataHandler)
        TwitterClient.instance
            .setToken(token)
            .setUserName(user)
            .fetchTweetsForLoggedInUser()
    }

    componentWillUnmount(): void {
        Dimensions.removeEventListener("change", this.onScreenChangeHandler)
        console.log("####### Tweetslist component Will unmount")
        this._tweetsSubscription?.remove()
    }

    render(): JSX.Element {
        const listHeaderComponent = <Header headerTitle="RTweetGettr" />

        const isDarkMode = this.state.isDarkMode
        const backgroundStyle = {
            backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        }

        // Don't use arrow functions in Flatlist - performance issues otherwise
        // https://codingislove.com/optimize-react-native-flatlist-performance/
        //
        // Can avoid
        console.log(`######## rendering - darkMode: ${this.state.isDarkMode}`)
        console.log(this.state.tweets)

        return (
            <FlatList
                ListHeaderComponent={listHeaderComponent}
                data={this.state.tweets}
                renderItem={this.itemRenderHandler}
                style={backgroundStyle}
                removeClippedSubviews={true}
                getItemLayout={itemLayout}
                refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this.onRefreshHandler}
                    />
                  }
            />
        )
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

    public static ITEM_HEIGHT = 44
}

export default TweetsList
