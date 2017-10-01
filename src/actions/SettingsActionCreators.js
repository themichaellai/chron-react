/*
 * Actions for the settings view (currently only implemented for Android)
 */

import store from '../store';
import _ from 'underscore';
import { AsyncStorage } from 'react-native';

// get the top level sections
const sectionsCursor = store.select('models', 'topLevelSections');

/*
 * Change whether a section is visible...section is the name of the section
 * that we are changing
 */
export async function changeSectionVisibility(sectionName) {
  const sections = sectionsCursor.get().slice().map(section => {
    if (section.name === sectionName) {
      return {...section, selected: !section.selected}; 
    }
    return section;
  })
  // update asyncstorage as well
  try {
    await AsyncStorage.setItem('@ChronStore:visibleSections', JSON.stringify(sections));
  } catch (error) { }
  sectionsCursor.set(sections);
}
