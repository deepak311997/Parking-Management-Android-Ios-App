import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, Alert } from 'react-native';
import { Content, Icon, CardItem, Card, Body} from 'native-base';
import { db } from '../config';

export default class reserveSlot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSlot: props.navigation.getParam('selectedSlot'),
            selectedWingName: props.navigation.getParam('selectedWingName'),
        }
    }
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Book Slot',
            headerStyle: {
                backgroundColor: '#e67300',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
    };

    onReserve = () => {
        const { selectedWingName, selectedSlot } = this.state;
        let obj = {};
        obj[selectedWingName] = selectedSlot;

        db.ref(`/AtriaParking/parkingWings/${selectedWingName}/${selectedSlot}`).update({ isAvailable: false, isReserved: true});
        db.ref(`/AtriaParking/reservations/users/admin`).update(obj);
        Alert.alert('Booking Confirmed',
            `Congrats your booking for ${selectedSlot} in ${selectedWingName} wing is blocked for you !!`,
            [
                {text: 'OK', onPress: () => this.props.navigation.goBack()},
            ]);
    };

    render() {
        const { selectedSlot, selectedWingName } = this.state;

        return (
            <View style={styles.container}>
                <Content padder>
                    <Card>
                        <CardItem header bordered>
                            <Text>Slot Confirmation</Text>
                        </CardItem>
                        <CardItem bordered>
                            <Body>
                            <Text>Wing Name: {selectedWingName}</Text>
                            </Body>
                        </CardItem>
                        <CardItem bordered>
                            <Body>
                            <Text>Slot Number: {selectedSlot}</Text>
                            </Body>
                        </CardItem>
                        <CardItem footer bordered>
                            <Button title='Confirm' onPress={() => this.onReserve()}/>
                        </CardItem>
                    </Card>
                </Content>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ebebeb'
    },
});
