import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CheckBox from 'react-native-check-box';
import { changeSectionVisibility } from './actions/SettingsActionCreators';
import store from './store';

// Get the sections
const sectionsCursor = store.select('models', 'topLevelSections');

const styles = StyleSheet.create({
  comingSoonView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  comingSoon: {
    fontSize: 30,
    color: '#083e8c',
  },
  topView: {
    marginTop: 60,
  },
  checkboxItem: {
    height: 40,
    padding: 10,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  checkboxLeftText: {
    fontSize: 16, 
  },
  subsection: {
    fontWeight: 'bold',
    padding: 5,
    fontSize: 18,
  },
});

/*
 *  Settings view for Android
 */
const Settings = React.createClass({

  getInitialState() {
    const sections = sectionsCursor.get();
    return {
      sections,
      checked: false,
    } 
  },

  componentDidMount: function() {
    sectionsCursor.on('update', this._updateState);
  },

  componentWillUnmount: function() {
    sectionsCursor.off('update', this._updateState);
  },

  _updateState() {
    this.setState({ sections: sectionsCursor.get() })
  },

  onCheckboxSelect(sectionName) {
    changeSectionVisibility(sectionName);
  },

  render() {
    const sectionOptions = this.state.sections.map((section, i) => (
      <CheckBox
        key={i}
        style={styles.checkboxItem}
        leftTextStyle={styles.checkboxLeftText}
        onClick={() => this.onCheckboxSelect(section.name)}
        isChecked={section.selected}
        leftText={section.name}
      />
    ));
    // return (
      // <View style={styles.topView}>
        // <Text style={styles.subsection}>Sections to Show</Text>
        // {sectionOptions}
      // </View>
    // );
    return (
      <View style={[styles.topView, styles.comingSoonView]}>
        <Text style={styles.comingSoon}>Coming Soon!</Text>
      </View>
    )
  },
});

export default Settings
