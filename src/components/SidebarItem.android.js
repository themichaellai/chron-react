/*
 * A clickable item that is displayed on the Android sidebar
 */

import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  item: {
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  text: {
    paddingLeft: 25,
    margin: 10,
    fontSize: 15,
    textAlign: 'left',
  },
});

const SidebarItem = React.createClass({

  propTypes: {
    icon: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func,
    style: React.PropTypes.object,
  },

  render() {
    return (
      <TouchableOpacity
        style={[styles.item, this.props.style]}
        onPress={this.props.onPress}>
        <Icon name={this.props.icon} color="#000" size={30} />
        <Text style={styles.text}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  },
});

export default SidebarItem;
