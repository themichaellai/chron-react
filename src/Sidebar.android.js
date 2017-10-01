/*
 * Sidebar for the android app
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import LinksListing from './LinksListing';
import TabView from './TabView.android';
import SidebarItem from './components/SidebarItem.android';
import Settings from './Settings.android';

const styles = StyleSheet.create({
  drawerHeader: {
    height: 100,
    padding: 10,
    backgroundColor: '#083e8c',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 23,
    fontFamily: 'Didot',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'lightgray',
  },
  logo: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 1,
    margin: 5,
    borderColor: '#fff',
  },
});

const Sidebar = React.createClass({

  propTypes: {
    replaceRoute: React.PropTypes.func.isRequired,
    closeDrawer: React.PropTypes.func.isRequired,
    openDrawer: React.PropTypes.func.isRequired,
  },

  replaceRoute(route) {
    this.props.replaceRoute(route);
    this.props.closeDrawer();
  },

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={styles.drawerHeader}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>The Chronicle</Text>
            <Text style={styles.headerSubtitle}>Duke's Independent News Organization</Text>
          </View>
          <Image source={require('./assets/chronlogo.png')} style={styles.logo} />
        </View>
        <SidebarItem
          icon="md-paper"
          title="News"
          onPress={() => this.replaceRoute({
            title: 'The Chronicle',
            component: TabView,
            titleStyleOverride: {
              fontFamily: 'Didot',
              fontSize: 25,
            },
            passProps: { openDrawer: this.props.openDrawer },
          })}
        />
        <SidebarItem
          icon="md-link"
          title="Links"
          onPress={() => this.replaceRoute({
            title: 'Links',
            component: LinksListing,
            passProps: { openDrawer: this.props.openDrawer },
          })}
        />
        {/* <View style={styles.borderBottom}/> */}
        <SidebarItem
          icon="md-settings"
          title="Settings"
          onPress={() => this.replaceRoute({
            title: 'Settings',
            component: Settings,
            passProps: { openDrawer: this.props.openDrawer },
          })}
        />
      </View>
    );
  },
});

export default Sidebar;
