import React from 'react'
import FastImage, { Source } from 'react-native-fast-image'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Colors from './Colors'
import Tweet from '../Model/Tweet'
import  { DEFAULT_PROFILE_IMAGE_SIZE } from './Dims'

type PropType = {
    tweet: Tweet
    isDarkMode: boolean
    profilePic: Source
}

class TweetRow extends React.PureComponent<PropType> {
    render(): JSX.Element {
        return (
            <View style={styles.sectionContainer}>
                <FastImage
                    style={styles.imageContainer}
                    source={this.props.profilePic}
                    resizeMode={FastImage.resizeMode.contain}
                />
                <View style={styles.textContainer}>
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
            </View>
        )
    }
}

const styles = StyleSheet.create({
    sectionContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.light,
        marginTop: 3,
        paddingHorizontal: 12,
        padding: 4,
        borderBottomColor: Colors.dark,
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    imageContainer: {
        flexBasis: DEFAULT_PROFILE_IMAGE_SIZE,
        height: DEFAULT_PROFILE_IMAGE_SIZE
    },
    textContainer: {
        flex: 1,
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
