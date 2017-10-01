const store = require('../store');
const _ = require('underscore');
const sectionsCursor = store.select('models', 'topLevelSections');
const pagesCursor = store.select('models', 'pages');
import { AsyncStorage } from 'react-native';

async function getVisibleSections() {
  let visibleSections;
  try {
    visibleSections = await AsyncStorage.getItem('@ChronStore:visibleSections');
    if (visibleSections === null) {
      visibleSections = {};
      for (const section of sections) {
        visibleSections[section.name] = true;
      }
      try {
        await AsyncStorage.setItem('@ChronStore:visibleSections', JSON.stringify(visibleSections));
      } catch (error) { }
    } else {
      visibleSections = JSON.parse(visibleSections);
    }
  } catch (error) { }
  return visibleSections;
}

const SectionActionCreators = {
  getSections: async () => {
    let sections = [
      ['section/news', 'News'],
      ['section/sports', 'Sports'],
      ['section/opinion', 'Opinion'],
      ['section/recess', 'Recess'],
      ['section/towerview', 'Towerview'],
      ['blog/blue-zone', 'Blue Zone'],
    ].map(([slug, name]) => { return {slug, name}; });
    // Getting asyncstorage
    const visibleSections = await getVisibleSections();
    sections = sections.map(section => {
      return {...section, selected: visibleSections[section.name]};
    });
    sectionsCursor.set(sections);
    const pageNumber = sections.map(({slug}) => { return [slug, 0]; });
    pagesCursor.set(_.object(pageNumber));
  },
};

module.exports = SectionActionCreators;
