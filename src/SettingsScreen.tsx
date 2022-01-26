import React from "react"
import { NavigationComponent, NavigationComponentProps, Options } from 'react-native-navigation';
import { Button, Dimensions, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native"
import Colors from './UI/Colors'
import { TwitterClient } from "./Model/TwitterClient";

type ChangeHandler = (text:string) => void

type PropsType = NavigationComponentProps

type StateType = unknown

class SettingsScreen extends NavigationComponent<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props)
        this.loginPressHandler = this.loginPressHandler.bind(this)
    }

    componentDidUpdate() {
        console.log("Settings screen updated")
    }

    componentWillUnmount() {
        console.log("Settings screen unmount")
    }

    componentDidMount() {
        console.log("Settings screen did mount")
    }

    loginPressHandler(): void {
        TwitterClient.instance.login()
    }

    getChangeHandlerFor(field: string): ChangeHandler {
        return (text: string) => {
            if (field === 'username') {
                TwitterClient.instance.userName = text
            } else if (field === 'token') {
                TwitterClient.instance.token = text
            }
        }
    }

    render(): JSX.Element {
        return (
            <SafeAreaView>
                <View style={this.styles.container}>
                    <View>
                        <Button 
                            color={Colors.primary}
                            title="Login"
                            onPress={this.loginPressHandler}
                        />
                        <Text style={this.styles.titleText}>Bearer Token</Text>
                        <TextInput
                            placeholder="token"
                            secureTextEntry={true}
                            multiline={true}
                            numberOfLines={5}
                            style={this.styles.textInput}
                            onChangeText={this.getChangeHandlerFor('token')}
                        />
                        <Text style={this.styles.titleText}>User name</Text>
                        <TextInput 
                            placeholder="@username" 
                            style={this.styles.textInput} 
                            onChangeText={this.getChangeHandlerFor('username')}
                        />
                    </View>
                </View>
            </SafeAreaView>
        )
    }

    screenWidth = Dimensions.get("screen").width

    styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            paddingTop: 250,
            backgroundColor: Colors.light
        },
        titleText: {
            color: Colors.dark,
            marginBottom: 20,
            fontSize: 30,
        },
        textInput: {
            padding: 5,
            paddingStart: 15,
            width: this.screenWidth * 0.8,
            borderWidth: 2,
            height: 40,
            marginBottom: 15,
            color: Colors.darker,
            backgroundColor: Colors.lighter,
            fontWeight: "600",
        },
        loginBtn: {
            paddingHorizontal: 25,
            paddingVertical: 10,
            color: Colors.primary,
            textAlign: "center",
        }
    })

    static options: Options = {
        topBar: {
            title: {
                text: "Settings"
            }
        },
        bottomTab: {
            text: "Settings",
            iconColor: Colors.dark,
            textColor: Colors.dark,
            selectedTextColor: Colors.primary,
            selectedIconColor: Colors.primary,
            icon: {
                system: 'gearshape.fill',
                fallback: require('./Icons/cog-solid.png')
            }
        },
    }
}

export default SettingsScreen