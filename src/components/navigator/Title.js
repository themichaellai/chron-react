import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

const styles = StyleSheet.create({
  navBarText: {
    fontSize: 20,
    marginVertical: 12,
  },
  navBarTitleText: {
    color: '#f8f8f8',
  },
});

const NavigatorTitle = React.createClass({
  propTypes: {
    text: React.PropTypes.string,
    styleOverride: Text.propTypes.style,
  },

  getDefaultProps: function() {
    return {
      text: '',
    };
  },

  render: function() {
    const stylesList = [
      styles.navBarText,
      styles.navBarTitleText,
      this.props.styleOverride,
    ];
    return (
      <Text style={stylesList}>
        {this.props.text}
      </Text>
    );
  },
});

export default NavigatorTitle;
