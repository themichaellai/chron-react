/*
 * The initial android route containing all of the different sections displayed as
 * scrollable tabs
 */

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import store from './store';
import SectionPostListing from './SectionPostListing';
import SectionActionCreators from './actions/SectionActionCreators';

// Get the sections
const sectionsCursor = store.select('models', 'topLevelSections');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: 50,
  },
  tabbar: {
    backgroundColor: '#083e8c',
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
  },
  appBar: {
  },
  tab: {
    // backgroundColor: '#fff',
    width: 120,
  },
  indicator: {
    backgroundColor: '#fff',
  },
  tabLabel: {
    color: '#fff',
  },
});

const TabView = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      index: 0,
      routes: null,
    };
  },

  componentDidMount: function() {
    if (sectionsCursor.get().length === 0) {
      SectionActionCreators.getSections();
    } else {
      this._updateState();
    }
    sectionsCursor.on('update', this._updateState);
  },

  componentWillUnmount: function() {
    sectionsCursor.off('update', this._updateState);
  },

  _updateState() {
    const routes = [{
      key: '1',
      title: 'Frontpage',
      section: { name: 'Frontpage', slug: 'frontpage' },
    }];
    sectionsCursor.get().forEach((section) => {
      routes.push({
        key: section.name,
        title: section.name,
        /* data that is passed into the SectionPostListing */
        section,
      });
    });
    this.setState({ routes });
  },

  _handleChangeTab(index) {
    this.setState({ index });
  },

  _renderHeader(props) {
    return (
      <View style={styles.appBar}>
        <View style={styles.header} />
        <TabBar
          {...props}
          style={styles.tabbar}
          scrollEnabled={true}
          indicatorStyle={styles.indicator}
          tabStyle={styles.tab}
          labelStyle={styles.tabLabel}
        />
      </View>
    );
  },

  /*
   * Function to render the scene in the currently active view. Note that
   * this should be replaced with Navigators. Need to deal with some performance
   * issues surrounding this library as well (as it is all js-based). Perhaps
   * need to consider switching to an alternative
   */
  _renderScene({ route }) {
    return (
      <SectionPostListing
        section={route.section}
        navigator={this.props.navigator}
      />
    );
  },

  render() {
    return this.state.routes === null ?  <View /> : (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onRequestChangeTab={this._handleChangeTab}
      />
    );
  },
});

export default TabView;
