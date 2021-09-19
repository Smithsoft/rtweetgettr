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

class Header extends React.Component<PropsType, StateType> {
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
        Appearance.removeChangeListener(this.handleAppearanceChange)
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
            paddingBottom: 40,
            paddingTop: 96,
            paddingHorizontal: 32,
        },
        logo: {
            opacity: 0.2,
            overflow: 'visible',
            resizeMode: 'cover',
            /*
             * These negative margins allow the image to be offset similarly across screen sizes and component sizes.
             *
             * The source logo.png image is 512x512px, so as such, these margins attempt to be relative to the
             * source image's size.
             */
            marginLeft: -128,
            marginBottom: -192,
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
        const logoWidth = 1132.29792
        const logoHeight = 790.67423

        return (
            <View>
                <HeaderLogo height={logoHeight/4} width={logoWidth/4} />
                <Text style={[this.styles.text, textStyling]}>
                    {this.props.headerTitle}
                </Text>
            </View>
        )
    }
}

export default Header
