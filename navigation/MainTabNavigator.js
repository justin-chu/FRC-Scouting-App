import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import RankingsScreen from '../screens/RankingsScreen';
import TeamInfo from '../screens/TeamInfo';
import LocalInfo from '../screens/LocalInfo';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Scout',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios' ? 'ios-create' : 'md-create'
      }
    />
  ),
};

const RanksStack = createStackNavigator(
  {
    Ranks: RankingsScreen,
    TeamInfo: TeamInfo
  },
  {
    initialRouteName: "Ranks"
  }
);

RanksStack.navigationOptions = {
  tabBarLabel: 'All Teams',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-people' : 'md-people'}
    />
  ),
};

const LocalStack = createStackNavigator(
  {
    LocalInfo: LocalInfo,
    TeamInfo: TeamInfo
  },
  {
    initialRouteName: "LocalInfo"
  }
);

LocalStack.navigationOptions = {
  tabBarLabel: 'Your Teams',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  LocalStack,
  RanksStack
});
