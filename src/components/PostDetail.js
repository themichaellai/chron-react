const _ = require('underscore');
const React = require('react-native');
const {
  StyleSheet,
  View,
  WebView,
} = React;
const { postPropTypes } = require('../utils/Post');
const { getWindowDimensions } = require('../utils/Image');
import { insertElAt } from '../utils/dom';

const paragraphAd = require('../../config/ad.json')['300x250'];

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
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
    font-weight: 600;
    font-size: 24px;
  }
  #image {
    flex: 1;
    width: ${fullWidth}px;
    margin-top: 15px;
    margin-bottom: 5px;
    margin-left: ${-gutterWidth}px;
  }
  body {
    font-family: 'Times';
    font-size: 18px;
    margin-left: 0;
    margin-right: 0;
    padding-left: ${gutterWidth}px;
    padding-right: ${gutterWidth}px;
  }
  #caption {
    color: '#999999';
    font-size: 12px;
    font-style: italic;
    margin-bottom: 25px;
  }
  .ad {
    text-align: center;
  }
  #byline {
    margin-top: 15px;
    margin-bottom: 14px;
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
    const author = (post.authors.length > 0) ? `<p id='byline'>By ${post.authors.join(', ')} </p>` : '';
    const image = (post.images.length > 0) ? `<img id='image' src='${post.images[0].previewUrl}'>` : '';
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
          <p id='caption'> ${caption} </p>
          <p id='byline'> ${author} </p>
          ${image}
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

    if ((url.split('.com'))[0].contains('disqus') && _.some(successes, (success) => {return url.contains(success); })) {
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
            html={this.getHTML()}
            automaticallyAdjustContentInsets={false}
            javaScriptEnabledAndroid={true}
            startInLoadingState={false}
            onNavigationStateChange={this.redirect}
            />
      </View>
    );
  },
});

module.exports = PostDetail;
