import React from 'react'
import { ColorSchemeName, Appearance } from 'react-native'

type PropsType = {
    handler: (mgr: AppearanceManager) => void
}

type StateType = {
    colorScheme: ColorSchemeName
}

class AppearanceManager extends React.Component<PropsType, StateType> {
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
        this.setState({ colorScheme })
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    render() {
        return null
    }
}

export default AppearanceManager
