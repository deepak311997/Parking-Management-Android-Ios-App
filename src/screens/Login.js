import React, {Component} from 'react';
import { StyleSheet , Alert} from 'react-native';
import * as firebase from 'react-native-firebase';
import Home from './Home';
import {Container, Content, Text, Form, Item, Input, View, Button, Icon} from "native-base";

const styles = StyleSheet.create({
    header: {
        color: 'white',
        fontSize: 20,
        marginLeft: 20,
    }
});

class Login extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            phoneNumber: '+91',
            isLoggedIn: false,
            isPhone: false,
            isOtpGenerated: false,
            OTP: null,
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Login',
            headerStyle: {
                backgroundColor: '#e67300',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
    };

    handleLogin = () => {
        const { username, password } = this.state;

        if(!username && !password) {
            Alert.alert('Please enter the username and password !!');
        } else if(!username) {
            Alert.alert('Please enter the username !!');
        } else if(!password) {
            Alert.alert('Please enter the password !!');
        } else {
            if(username === 'admin' && password === 'admin') {
                Alert.alert('Login Successful', '' ,  [
                    {text: 'OK', onPress: () => this.props.navigation.navigate('Home')},
                ]);
                this.setState({ isLoggedIn: true })
            } else {
                Alert.alert('Invalid Credentials !!');
            }
        }
    };

    onGenerateOTP = () => {
        const { phoneNumber } = this.state;

        firebase.auth().signInWithPhoneNumber(phoneNumber)
            .then((confirmResult) => {
                this.setState({ confirmResult, isOtpGenerated: true });
            })
            .catch((error) => {
                const { code, message } = error;
                console.warn(message);
            });
    };

    validateOTP = () => {
        const { confirmResult, OTP } = this.state;

        confirmResult.confirm(OTP)
            .then((user) => {
                this.props.navigation.navigate('Home');
            })
            .catch((error) => {
                const { code, message } = error;
                Alert.alert('Invalid OTP !! Try Again');
            });
    };

    render() {
        const { isPhone, isOtpGenerated, phoneNumber, OTP } = this.state;

        return (
            <Container>
                <Content>
                    <Form>
                        {!isPhone ?
                        <View style={{ margin: 20 }}>
                            <Text>Username</Text>
                            <Item>
                                <Icon name="person" style={{fontSize: 20, marginLeft: 20, color: 'black'}}/>
                                <Input onChangeText={(username) => this.setState({username})}/>
                            </Item>
                            <Text>Password</Text>
                            <Item last>
                                <Icon name="lock" style={{fontSize: 20, marginLeft: 20, color: 'black'}}/>
                                <Input onChangeText={(password) => this.setState({password})}/>
                            </Item>
                            <Button
                                onPress={this.handleLogin}
                                style={{ margin: 20, alignItems: 'center' }}
                                rounded
                                primary
                            >
                                <Text> Submit </Text>
                            </Button>
                            <Button
                                onPress={ () => this.setState({ isPhone: true })}
                                style={{ marginLeft: 20,marginTop: 10, alignItems: 'center' }}
                                rounded
                                primary
                            >
                                <Text> Sign in with Phone Number </Text>
                            </Button>
                        </View> :
                            <View style={{ margin: 20 }}>
                                { !isOtpGenerated ?
                                <View>
                                    <Text>Phone Number</Text>
                                    <Item>
                                        <Icon name="phone-portrait" style={{fontSize: 20, marginLeft: 20, color: 'black'}}/>
                                        <Input value={phoneNumber} onChangeText={(phoneNumber) => this.setState({phoneNumber})}/>
                                    </Item>
                                    <Button
                                        onPress={ () => this.onGenerateOTP()}
                                        style={{ margin: 20, alignItems: 'center' }}
                                        rounded
                                        primary
                                    >
                                        <Text> Generate OTP </Text>
                                    </Button>
                                </View> :
                                <View>
                                    <Text>OTP</Text>
                                    <Item>
                                        <Icon name="finger-print" style={{fontSize: 20, marginLeft: 20, color: 'black'}}/>
                                        <Input value={OTP} onChangeText={(OTP) => this.setState({OTP})}/>
                                    </Item>
                                    <Button
                                        onPress={ () => this.validateOTP()}
                                        style={{ margin: 20, alignItems: 'center' }}
                                        rounded
                                        primary
                                    >
                                        <Text> Validate </Text>
                                    </Button>
                                </View> }
                            </View>
                        }
                    </Form>
                </Content>
            </Container>
        );
    }
}

export default Login;
