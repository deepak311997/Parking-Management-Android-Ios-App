import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, CardItem, Content, Left, Right, Icon, Text } from 'native-base';

import { db } from '../config';

let itemsRef = db.ref('/');

export default class ListLocations extends Component {
    state = {
        data: {},
        selectedLocation: null,
        isLoading: true,
    };

    componentDidMount() {
        itemsRef.on('value', snapshot => {
            let data = snapshot.val();
            this.setState({ data, isLoading: false });
        });
    }

    getLocationsList = () => {
        const { data } = this.state;
        let locationList = [];

        Object.keys(data).map((location, index) => {
            locationList.push(
                <CardItem
                    button
                    key={`${location}-${index}`}
                    onPress={() => this.props.navigation.navigate('WingList', { selectedLocation: location } )}
                >
                    <Left>
                        <Text>{data[location].location}</Text>
                    </Left>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </CardItem>
            );
        });
        return locationList;
    };

    render() {
        const { isLoading } = this.state;
        return (
            <View style={styles.container}>
                <Content padder>
                    <Card>
                        <CardItem header bordered>
                            <Text style={styles.cardHeader}>Available Locations</Text>
                        </CardItem>
                        {!isLoading && this.getLocationsList()}
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
    cardHeader: {
        color: 'blue',
    }
});
