import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import {Button, Content, Icon, Left, List, ListItem, Right} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import reserveSlot from './reserveSlot';
import { db } from '../config';

export default class ItemComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
          wingData: {},
          wingName: this.props.navigation.getParam('wingName')
        };
        this.slotList = db.ref(`/AtriaParking/parkingWings/${props.navigation.getParam('wingName')}`);
    }

    componentDidMount() {
        this.slotList.on('value', snapshot => {
            this.setState({ wingData: snapshot.val() });
        });
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('Available Slots'),
            headerStyle: {
                backgroundColor: '#e67300',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            headerRight: (
                <Button
                    onPress={() => alert('You can select only 1 slot !!')}
                    title="Info"
                    color="#000"
                    transparent
                    style={styles.infoButton}
                >
                    <Icon name='info' />
                </Button>
            ),
        };
    };

    generateSlots = () => {
        const { wingData, wingName } = this.state;
        let slotsView = [];

        Object.keys(wingData).map((slot,index) => {
            slotsView.push(
                <ListItem
                    key={slot}
                    onPress={() => this.props.navigation.navigate('reserveSlot', { 'selectedSlot': slot, 'selectedWingName': wingName }) }
                    last
                    disabled={!wingData[slot].isAvailable}
                    style={[ wingData[slot].isAvailable ? styles.freeParkingSlot : styles.busyParkingSlot ]}
                >
                    <Left>
                        <Text>{slot}</Text>
                    </Left>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>
                );
        });
        return slotsView;
    };

    render() {
        return (
            <View style={styles.container}>
                <Content>
                    <List>
                        {this.generateSlots()}
                    </List>
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
    itemsList: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    freeParkingSlot: {
        backgroundColor: 'green',
    },
    busyParkingSlot: {
        backgroundColor: 'red',
    },
    parkingSlot: {
        height: '33.33%',
        width: '20%',
        margin: 10
    },
    infoButton: {
        alignContent: 'center'
    }
});
