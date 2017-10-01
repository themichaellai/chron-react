import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import NavigatorTitle from './components/navigator/Title';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  navBarText: {
    fontSize: 20,
    marginVertical: 12,
  },
  toolbarIcon: {
    marginTop: 12,
  },
  menuIcon: {
    marginLeft: 10,
  },
  moreIcon: {
    marginRight: 10,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarLeftArrow: {
    paddingRight: 10,
    fontFamily: 'Apple SD Gothic Neo',
    fontWeight: '800',
  },
  navBarButtonText: {
    color: '#f8f8f8',
  },
});

export const NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return (
        <TouchableOpacity onPress={route.passProps.openDrawer}>
          <Icon
            name="md-menu"
            size={30}
            color="#fff"
            style={[styles.toolbarIcon, styles.menuIcon]}
          />
        </TouchableOpacity>
      );
    }

    const previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
          onPress={() => navigator.pop()}
          style={styles.navBarLeftButton}>
        <View>
          <Text style={[styles.navBarText, styles.navBarButtonText]}>
            <Icon name="md-arrow-back" color="#fff" size={20} />
            {"  "}
            {previousRoute.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index) {
    if (index === 0) {
      return (
        <TouchableOpacity>
          <Icon
            name="md-more"
            size={30}
            color="#fff"
            style={[styles.toolbarIcon, styles.moreIcon]}
          />
        </TouchableOpacity>
      );
    }
    return null;
  },

  Title: function(route) {
    return (
      <NavigatorTitle
        styleOverride={route.titleStyleOverride}
        text={route.title} />
    );
  },
};
