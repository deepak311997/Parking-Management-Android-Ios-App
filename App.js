import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from './src/screens/Home';

// we will use these two screens later in our AppNavigator
import WingList from './src/screens/WingList';
import ItemComponent from './src/components/ItemComponent';
import reserveSlot from './src/components/reserveSlot';
import ListLocations from './src/screens/ListLocations';
import Login from './src/screens/Login';

const AppNavigator = createStackNavigator(
    {
        Home,
        Login,
        WingList,
        ItemComponent,
        reserveSlot,
        ListLocations
    },
    {
        initialRouteName: 'Login'
    }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
    render() {
        return <AppContainer />;
    }
}
