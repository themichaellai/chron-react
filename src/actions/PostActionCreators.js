var _ = require('underscore');
var store = require('../store');
var postsCursor = store.select('models', 'posts');
var sectionIdsCursor = store.select('models', 'sectionIds');
var { rawDataToPost } = require('../utils/Post');

var urlBuilder = (sectionName) => {
    if (sectionName !== 'frontpage') {
	return `http://www.dukechronicle.com/section/${sectionName}.json`;
    } else {
	return 'http://www.dukechronicle.com/.json';
    }	
}

var getSection = (section) => {
  fetch(urlBuilder(section))
    .then((response) => response.json())
    .then((responseData) => {
      var articles = responseData[0].articles;
      var articlesMap = _.object(
        _.map(_.values(articles), (a) => [a.uid, rawDataToPost(a)]));
      postsCursor.merge(articlesMap);
      sectionIdsCursor.merge({[section]: _.keys(articlesMap)});
    })
    .catch((error) => {
      console.warn(error);
      // TODO: change some view state
    })
    .done();
}

var PostActionCreators = {
  getFrontpage: () => {
    getSection('frontpage');
  },
  getSection: (section) => {
    getSection(section);
  },
};

module.exports = PostActionCreators;
