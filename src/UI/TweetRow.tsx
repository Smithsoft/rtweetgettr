import React from 'react'
import FastImage, { Source } from 'react-native-fast-image'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { View, Text, StyleSheet } from 'react-native'
import Colors from './Colors'
import Tweet from '../Model/Tweet'
import ITEM_HEIGHT from './Dimensions'

type PropType = {
    tweet: Tweet
    isDarkMode: boolean
    profilePic: Source
}

class TweetRow extends React.PureComponent<PropType> {
    render(): JSX.Element {
        return (
            <View style={styles.sectionContainer}>
                {/* <FastImage
                    style={{ width: 200, height: 200 }}
                    source={this.props.profilePic}
                    resizeMode={FastImage.resizeMode.contain}
                /> */}
                <Text
                    style={[
                        styles.sectionTitle,
                        {
                            color: this.props.isDarkMode
                                ? Colors.white
                                : Colors.black,
                        },
                    ]}>
                    {this.props.tweet.name}
                </Text>
                <Text
                    style={[
                        styles.sectionDescription,
                        {
                            color: this.props.isDarkMode
                                ? Colors.light
                                : Colors.dark,
                        },
                    ]}>
                    {this.props.tweet.text}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    sectionContainer: {
        height: ITEM_HEIGHT,
        backgroundColor: Colors.light,
        marginTop: 3,
        paddingHorizontal: 12,
        padding: 4,
        borderBottomColor: Colors.dark,
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 3,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
})

export default TweetRow
