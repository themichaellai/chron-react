const _ = require('underscore');
const he = require('he');
const React = require('react-native');
const urlencode = require('urlencode');

import { extractHtmlText } from './dom';

// Strings are urlencoded with utf-8 and also include HTML entities.
const unescape = (str) => he.unescape(urlencode.decode(str));

/**
 * Helper function to clean media objects from the API.
 * @param {Object} m Media object from the API.
 * @return {Object} A nicer, unescaped version of the media.
 */
const cleanMedia = (m) => {
  return {
    caption: extractHtmlText(unescape(m.caption)),
    authors: _.map(_.values(m.getAuthor), (author) => unescape(author)),
    thumbnailUrl: unescape(m.urlThumbnail),
    previewUrl: unescape(m.urlPreview),
    originalUrl: unescape(m.originalUrl),
  };
};

/**
 * Helper function to clean tag objects from the API.
 * @param {Object} t Tag object from the API.
 * @return {Object} A nicer, unescaped version of the tag.
 */
const cleanTag = (t) => {
  return {
    name: unescape(t.name),
  };
};

/**
 * Sorts 'articles' so that articles tagged with 'newsletter' are at the top.
 * @param {Array} articles An array of articles that follow the structure in
 *   postPropTypes
 * @return {Array} An array where 'newsletter' articles are at the front of the
 *   array.
 */
const frontpageSort = (articles) => {
  const [topPosts, bottomPosts] = articles.reduce(([top, bottom], article) => {
    const tagNames = article.tags.map((t) => t.name);
    if (_.contains(tagNames, 'newsletter')) {
      return [top.concat([article]), bottom];
    }
    return [top, bottom.concat([article])];
  }, [[], []]);
  return topPosts.concat(bottomPosts);
};

/**
 * Returns true if the tag name is a tag used internally, or if it has some
 * useful meaning to the user.
 * @param {String} tagName A string representing the tag name.
 * @return {Boolean}
 */
const isInternalTag = (tagName) => {
  const invalidRegexes = [
    /top/gi,
    /newsletter/i,
    /hot/i,
    /homepage/i,
    /columnist/i,
  ];
  return _.some(invalidRegexes.map((re) => re.test(tagName)));
};

/**
 * Helper function to clean post objects from the API.
 * @param {Object} a Post object from the API.
 * @return {Object} A nicer, unescaped version of the post.
 */
const rawDataToPost = (a) => {
  return {
    title: unescape(a.headline),
    body: unescape(a.copy),
    teaser: extractHtmlText(unescape(a.abstract)),
    published: new Date(a.published * 1000),
    authors: _.map(_.values(a.getAuthor), (author) => unescape(author)),
    images: _.map(_.values(a.media), cleanMedia),
    tags: _.map(_.values(a.tags), cleanTag),
    url: unescape(a.getURL),
  };
};

/**
 * PropTypes for a post.
 */
const postPropTypes = React.PropTypes.shape({
  title: React.PropTypes.string.isRequired,
  body: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired,
  image: React.PropTypes.shape({
    thumbnail_url: React.PropTypes.string,
    caption: React.PropTypes.string,
  }),
});

module.exports = {
  frontpageSort,
  isInternalTag,
  rawDataToPost,
  postPropTypes,
};
