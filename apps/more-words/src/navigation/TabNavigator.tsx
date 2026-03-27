import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FeedScreen, DeckScreen, PlayScreen, SettingsScreen} from '../screens';

export type TabParamList = {
  Feed: undefined;
  Deck: undefined;
  Play: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0d0d0d',
          borderTopColor: '#1a1a1a',
        },
        tabBarActiveTintColor: '#d4af37',
        tabBarInactiveTintColor: '#555555',
      }}>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Deck" component={DeckScreen} />
      <Tab.Screen name="Play" component={PlayScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
