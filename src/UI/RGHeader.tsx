import {
    Appearance,
    ColorSchemeName,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import React from 'react'
import Colors from './Colors'
import HeaderLogo from './viral_tweet.svg'

type PropsType = {
    headerTitle: string
}

type StateType = {
    colorScheme: ColorSchemeName
}

class RGHeader extends React.Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props)
        this.handleAppearanceChange = this.handleAppearanceChange.bind(this)
    }

    state = {
        colorScheme: Appearance.getColorScheme(),
    }

    componentDidMount(): void {
        Appearance.addChangeListener(this.handleAppearanceChange)
    }

    componentWillUnmount(): void {
        //Appearance.removeChangeListener(this.handleAppearanceChange)
    }

    handleAppearanceChange(
        preferences: Appearance.AppearancePreferences,
    ): void {
        const { colorScheme } = preferences
        this.setState((prevState) => { 
            return { ...prevState, colorScheme }
        })
    }

    styles = StyleSheet.create({
        background: {
            alignItems: 'center',
            paddingBottom: 20,
            paddingTop: 32,
            paddingHorizontal: 32,
            borderBottomWidth: 2,
            borderBottomColor: Colors.light
        },
        text: {
            fontSize: 40,
            fontWeight: '700',
            textAlign: 'center',
        },
    })

    render(): JSX.Element {
        const imageBackgroundStyling = {
            backgroundColor:
                this.state.colorScheme === 'dark'
                    ? Colors.darker
                    : Colors.lighter,
        }
        const textStyling = {
            color:
                this.state.colorScheme === 'dark' ? Colors.white : Colors.black,
        }

        // Magic numbers from inspection of viral_tweet.svg
        const logoWidth = 1132.29792
        const logoHeight = 790.67423

        return (
            <View style={[this.styles.background, imageBackgroundStyling]}>
                <HeaderLogo height={logoHeight/4} width={logoWidth/4} />
                <Text style={[this.styles.text, textStyling]}>
                    {this.props.headerTitle}
                </Text>
            </View>
        )
    }
}

export default RGHeader
