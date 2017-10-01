import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  WebView,
} from 'react-native';
const _ = require('underscore');
const { postPropTypes, getPublishedDate } = require('../utils/Post');
const { getWindowDimensions } = require('../utils/Image');
import { insertElAt } from '../utils/dom';

const paragraphAd = require('../../config/ad.json')['300x250'];

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    ...Platform.select({
      ios: {
        marginBottom: 27,
      },
      android: {},
    }),
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

const innerStyles = (fullWidth) => {
  const gutterWidth = 10;
  return `
  #title {
    flex: 1;
    font-size: 24px;
    margin-bottom: 5px;
    font-weight: bold;
  }
  #image {
    margin-top: 10px;
  }
  img {
    flex: 1;
    max-width: ${fullWidth}px;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: ${-gutterWidth}px;
  }
  .image {
    width: ${fullWidth}px;
  }
  body {
    font-family: 'Georgia';
    font-size: 18px;
    margin-left: 0;
    margin-right: 0;
    padding-left: ${gutterWidth}px;
    padding-right: ${gutterWidth}px;
  }
  #caption {
    color: #666;
    font-size: 14px;
    margin: 5px 0;
    font-family: 'Helvetica'
  }
  .ad {
    text-align: center;
  }
  .postInfo {
    margin: 2px;
    font-size: 12px;
  }
  .capitalized {
    text-transform: uppercase;
  }
  #byline {
    font-weight: bold;
    margin-top: 10px;
  }`;
};

/**
 * PostDetail is a component that renders a post.
 */
const PostDetail = React.createClass({
  propTypes: {
    post: postPropTypes.isRequired,
    navigator: React.PropTypes.object.isRequired,
  },

  getBodyHTML: function() {
    const { link, image } = paragraphAd;
    const adHTML = `
      <div class="ad">
        <a href="${link}"><img src="${image}"></a>
      </div>
    `;
    const res = insertElAt(this.props.post.body, adHTML, 2);
    return res;
  },

  getHTML: function() {
    const post = this.props.post;

    const caption = (post.images.length > 0 && post.images[0].caption !== '') ? post.images[0].caption : '';
    const author = (post.authors.length > 0) ? `By <span class='capitalized'>${post.authors.join(', ')}</span>` : '';
    const image = (post.images.length > 0) ? `<img id='image' class='image' src='${post.images[0].previewUrl}'>` : '';
    const published = `Published: ${getPublishedDate(post.published)}`;
    const disqusHTML = `
      <!DOCTYPE html>
      <div id='disqus_thread'></div>
      <script type='text/javascript'>
        var disqus_url = '${post.url}';
        (function(){ var dsq = document.createElement('script');
        dsq.type = 'text/javascript';
        dsq.async = true;
        dsq.src = 'http://dukechronicle.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq); })();
      </script>
    `;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style> ${innerStyles(getWindowDimensions().width)} </style>
          <p id='title'> ${post.title} </p>
          <p id='byline' class='postInfo'> ${author} </p>
          <p id='published' class='postInfo'> ${published} </p>
          ${image}
          <p id='caption'> ${caption} </p>
          ${this.getBodyHTML()}
          ${disqusHTML}
        </head>
      </html>
    `;
  },

  redirect: function(navState) {
    if (navState.loading === true) {
      return;
    }
    const url = navState.url;
    const successes = [
      'disqus.com/next/login-success',
      'disqus.com/_ax/google/complete',
      'disqus.com/_ax/twitter/complete',
      'disqus.com/_ax/facebook/complete',
    ];

    if (_.some(successes, (success) => { return url.includes(success); })) {
      this.props.navigator.push({
        title: '',
        type: 'PostDetail',
        component: PostDetail,
        passProps: {post: this.props.post, navigator: this.props.navigator},
      });
    }
  },

  render: function() {
    return (
      <View style={styles.container}>
        <WebView
            source={{html: this.getHTML()}}
            automaticallyAdjustContentInsets={false}
            javaScriptEnabled={true}
            startInLoadingState={false}
            onNavigationStateChange={this.redirect}
            />
      </View>
    );
  },
});

module.exports = PostDetail;
