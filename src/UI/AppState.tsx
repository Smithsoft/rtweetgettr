import { Component } from "react";
import { AppState, AppStateStatus } from "react-native";

type AppStateTransitionHandler = (mgr: AppStateManager, newState: AppStateStatus) => void

type PropsType = {
    comeToForegroundHandler: AppStateTransitionHandler,
    moveToBackgroundHanlder: AppStateTransitionHandler
}

type StateType = {
    appState: AppStateStatus
}

class AppStateManager extends Component<PropsType, StateType> {
    state = {
        appState: AppState.currentState
    }
    
    constructor(props: PropsType) {
        super(props)
        this.handleAppStateChange = this.handleAppStateChange.bind(this)
    }
    
    handleAppStateChange(nextAppState: AppStateStatus): void {
        const appState = this.state.appState
        if (appState === 'inactive' || appState === 'background') {
            console.log("App has come to the foreground!");
            this.props.comeToForegroundHandler(this, nextAppState)
        } 
        if (nextAppState === 'background' || nextAppState === 'inactive') {
            console.log("App will go into background/inactive state")
            this.props.moveToBackgroundHanlder(this, nextAppState)
        }
        this.setState({ appState: nextAppState });
    }
    
    componentDidMount(): void {
        AppState.addEventListener("change", this.handleAppStateChange)
    }

    componentWillUnmount(): void {
        AppState.removeEventListener("change", this.handleAppStateChange)
    }
            
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    render() {
        return null
    }
}

export default AppStateManager