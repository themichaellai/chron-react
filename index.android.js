/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React from 'react';
import {
  AppRegistry,
  Navigator,
  DrawerLayoutAndroid,
  StatusBar,
  StyleSheet,
} from 'react-native';
import TabView from './src/TabView.android';
import Sidebar from './src/Sidebar.android';
import { NavigationBarRouteMapper } from './src/NavigationBarRouteMapper.android';

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#083e8c',
    flex: 1,
    flexDirection: 'row',
  },
});

const chronreact = React.createClass({

  componentDidMount() {
    StatusBar.setBackgroundColor('#000B59');
  },

  _renderScene(route, navigator) {
    return (
      <route.component
        navigator={navigator}
        {...route.passProps} />
    );
  },

  _renderNavigationBar() {
    return (
      <Navigator.NavigationBar
        routeMapper={NavigationBarRouteMapper}
        style={styles.navBar}
      />
    );
  },

  openDrawer() {
    this.refs.drawer.openDrawer();
  },

  closeDrawer() {
    this.refs.drawer.closeDrawer();
  },

  replaceRoute(route) {
    this.refs.navigator.replace(route);
  },

  render() {
    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        ref="drawer"
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => (
          <Sidebar
            replaceRoute={this.replaceRoute}
            closeDrawer={this.closeDrawer}
            openDrawer={this.openDrawer}
          />
        )}>
        <Navigator
          ref="navigator"
          initialRoute={{
            title: 'The Chronicle',
            component: TabView,
            titleStyleOverride: {
              fontFamily: 'Didot',
              fontSize: 25,
            },
            passProps: { openDrawer: this.openDrawer },
          }}
          renderScene={this._renderScene}
          navigationBar={this._renderNavigationBar()}
        />
      </DrawerLayoutAndroid>
    );
  },
});

AppRegistry.registerComponent('chronreact', () => chronreact);
