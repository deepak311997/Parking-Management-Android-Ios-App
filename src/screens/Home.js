import React, { Component } from 'react';
import {Alert, StyleSheet} from 'react-native';
import { Button, Container, Text, Content, Card, CardItem, Body, Spinner } from 'native-base';
import { db } from '../config';
import ListLocations from './ListLocations';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parkingAreas: {},
            totalSlots: 0,
            totalWings: 0,
            totalLocations: 0,
            isLoading: true,
            isReserved: false,
            reservedWingName: '',
            reservedSlot: '',
        }
    }
    static navigationOptions = () => {
        return {
            title: 'Home',
            headerStyle: {
                backgroundColor: '#e67300',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            headerLeft: null,
        }
    };

    componentDidMount() {
        let itemsRef = db.ref('/');

        itemsRef.on('value', snapshot => {
            let data = snapshot.val();

            this.setState({ parkingArea: data, isLoading: false }, () => {
                this.getTotalCounts();
                this.checkReservations();
            });
        });
    }

    checkReservations = () => {
        const { parkingArea } = this.state;
        const user = parkingArea['AtriaParking'].reservations ? parkingArea['AtriaParking'].reservations.users : false;
        const wingName = user['admin'] ? Object.keys(user['admin'])[0] : '';

        if(user && user.hasOwnProperty('admin')) {
            this.setState({ isReserved: true, reservedWingName: wingName, reservedSlot: user['admin'][wingName] });
        } else {
            this.setState({ isReserved: false });
        }
    };

    getTotalCounts() {
        const { parkingArea } = this.state;
        let totalSlots = 0, totalWings = 0;

        Object.keys(parkingArea).map(area => {
            totalSlots = totalSlots + parkingArea[area].totalNoOfSlots;
            totalWings = totalWings + parkingArea[area].totalNoOfWings;
        });
        this.setState({ totalSlots, totalWings, totalLocations: Object.keys(parkingArea).length });
    }

    deleteReservation = () => {
        const { reservedSlot, reservedWingName } = this.state;

        db.ref(`/AtriaParking/parkingWings/${reservedWingName}/${reservedSlot}`).update({ isAvailable: true, isReserved: false});
        db.ref(`/AtriaParking/reservations/users/admin`).remove();
    };

    render() {
        const { isLoading, totalSlots, totalWings, totalLocations, isReserved } = this.state;

        return (
            <Container style={styles.container}>
                {!isLoading &&
                <Content padder>
                    <Card>
                        <CardItem header bordered>
                            <Text>Overview</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text>
                                    Total Parking Locations: {totalLocations}
                                </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text>
                                    Total Parking Slots: {totalSlots}
                                </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text>
                                    Total Parking Wings: {totalWings}
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Button style={styles.reserveButton} block onPress={() => this.props.navigation.navigate('ListLocations')}>
                        <Text>Reserve Parking Slot</Text>
                    </Button>
                    {isReserved &&
                    <Button style={styles.reserveButton} block onPress={() =>  Alert.alert('Cancel Reservation',
                        `Are you sure you want to cancel your reservation?`,
                        [
                            {text: 'Close' },
                            {text: 'Cancel', onPress: () => this.deleteReservation()},
                        ])}>
                        <Text>Delete Reserved Slot</Text>
                    </Button>}
                </Content>}
                {isLoading && <Spinner style={styles.spinner} color='blue' />}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: '25%',
    },
    reserveButton: {
        marginTop: 20,
    },
    spinner: {
        marginTop: '30%',
    }
});
