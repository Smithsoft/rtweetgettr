import React from 'react'
import {
    Appearance,
    FlatList,
    ListRenderItemInfo,
    StyleSheet,
} from 'react-native'
import { Source } from 'react-native-fast-image'

import Tweet from '../Model/Tweet'
import AppearanceManager from './AppearanceManager'
import Colors from './Colors'
import Header from './RGHeader'
import TweetRow from './TweetRow'

const ITEM_HEIGHT = 44

const keyExtractor = (item: Tweet): string => `${item.id}`

type LayoutParams = {
    length: number
    offset: number
    index: number
}

const itemLayout = (
    data: Tweet[] | null | undefined,
    index: number,
): LayoutParams => {
    return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
}

type PropsType = {
    tweetData: Tweet[]
    isDarkMode: boolean
}

type StateType = unknown

class TweetsList extends React.PureComponent<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props)
        this.itemRenderHandler = this.itemRenderHandler.bind(this)
    }

    state = {
        isDarkMode: Appearance.getColorScheme() === 'dark',
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

    render(): JSX.Element {
        const listHeaderComponent = <Header headerTitle="RTweetGettr" />

        const isDarkMode = this.state.isDarkMode
        const backgroundStyle = {
            backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        }

        const tweets = this.props.tweetData

        // Don't use arrow functions in Flatlist - performance issues otherwise
        // https://codingislove.com/optimize-react-native-flatlist-performance/
        //
        // Can avoid
        console.log(`######## rendering - darkMode: ${this.state.isDarkMode}`)

        return <FlatList
                    ListHeaderComponent={listHeaderComponent}
                    data={tweets}
                    renderItem={this.itemRenderHandler}
                    style={backgroundStyle}
                    removeClippedSubviews={true}
                    getItemLayout={itemLayout}
                    keyExtractor={keyExtractor}
                />
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
}

export default TweetsList
