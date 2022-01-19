import React from "react"

import { Appearance, View, Text } from 'react-native';
import { NavigationComponent, NavigationComponentProps } from 'react-native-navigation';

type PropsType = NavigationComponentProps & { tweetIndex: number }

type StateType = {
    isDarkMode: boolean
    hasError: boolean
    errMessage: string
}

class DetailScreen extends NavigationComponent<PropsType, StateType> {
    state = {
        isDarkMode: Appearance.getColorScheme() === 'dark',
        hasError: false,
        errMessage: ''
    }

    render(): JSX.Element {
        return <View><Text>Tweet no. { this.props.tweetIndex }</Text></View>
    }
}

export default DetailScreen