import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Card, CardItem, Content, Left, Right, Icon, Spinner} from 'native-base';

import { db } from '../config';

export default class WingList extends Component {
    state = {
        data: {},
        isLoading: true,
    };

    componentDidMount() {
        const selectedLocation = this.props.navigation.getParam('selectedLocation');
        db.ref(`/${selectedLocation}`).on('value', snapshot => {
            let data = snapshot.val();
            this.setState({ data, isLoading: false });
        });
    }

    componentWillUnmount() {
      db.goOffline();
    };

    getWingList = () => {
      const { parkingWings } = this.state.data;
      let wingsList = [];

      Object.keys(parkingWings).map((wing, index) => {
              wingsList.push(
                  <CardItem
                      button
                      key={`${wing}-${index}`}
                      onPress={() => this.props.navigation.navigate('ItemComponent', { wingData: parkingWings[wing], wingName: wing } )}
                  >
                      <Left>
                          <Text>{wing}</Text>
                      </Left>
                      <Right>
                          <Icon name="arrow-forward" />
                      </Right>
                  </CardItem>
              );
      });
      return wingsList;
    };

    render() {
        const { data, isLoading } = this.state;
        return (
            <View style={styles.container}>
                <Content padder>
                    {isLoading && <Spinner style={styles.spinner} color='blue' />}
                    {!isLoading && <Card>
                        <CardItem header bordered>
                            <Text style={styles.cardHeader}>Available Wings</Text>
                        </CardItem>
                        {this.getWingList()}
                    </Card>}
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
    spinner: {
        marginTop: '30%',
    },
    cardHeader: {
        color: 'blue',
    }
});
