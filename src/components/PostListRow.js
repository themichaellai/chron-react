import React from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  Image,
  Platform,
  Text,
  View,
} from 'react-native';

import { postPropTypes, getPublishedDate, computeTagString } from '../utils/Post';
const { getPostImageHeight } = require('../utils/Image');

const styles = StyleSheet.create({
  postRowContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 7,
    borderColor: '#DDDDDD',
  },
  postRowImageContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 10,
    borderBottomWidth: 7,
    borderColor: '#DDDDDD',
  },
  highlight: {
    flex: 1,
    marginLeft: -15,
    marginRight: -15,
  },
  articleContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
    ...Platform.select({
      ios: {},
      android: {
        paddingLeft: 15,
        paddingRight: 15,
      },
    }),
  },
  tags: {
    fontSize: 13,
    color: '#333',
  },
  title: {
    fontSize: 20,
    textAlign: 'left',
    fontWeight: '600',
    marginBottom: 3,
  },
  teaser: {
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 3,
  },
  thumbnail: {
    marginBottom: 15,
    height: getPostImageHeight(),
  },
  articleInfo: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'whitesmoke',
    marginTop: 5,
    paddingTop: 8,
  },
});

/**
 * PostListRow is a view that is used inside of list views to render a Post.
 */
export const PostListRow = React.createClass({
  /**
   * 'post' is a post.
   *
   * 'rowPressed' is a function that is called when the view is pressed.
   */
  propTypes: {
    post: postPropTypes,
    rowPressed: React.PropTypes.func.isRequired,
  },

  render: function() {
    const post = this.props.post;
    let image;
    if (post.images.length > 0) {
      image = (
        <Image
          source={{uri: post.images[0].thumbnailUrl}}
          resizeMode={Image.resizeMode.cover}
          style={styles.thumbnail} />
      );
    }

    // create the tags string
    const tagsString = computeTagString(post.tags);

    // determine what style the post row should have based on
    // whether or not there is an image
    const postRowStyle = post.images.length > 0 ?
          styles.postRowImageContainer :
          styles.postRowContainer;
    const dateString = getPublishedDate(post.published, false);
    return (
      <TouchableHighlight
        onPress={() => this.props.rowPressed(post)}
        style={styles.highlight}
        underlayColor="#fff">
        <View style={ postRowStyle }>
          {image}
          <View style={styles.articleContainer}>
            <Text style={styles.title}>{post.title}</Text>
            <Text numberOfLines={3} style={styles.teaser}>{post.teaser}</Text>
            <View style={styles.articleInfo}>
              <Text numberOfLines={1} style={styles.tags}>{tagsString}</Text>
              <View style={{flex: 1}} />
              <Text numberOfLines={1} style={styles.tags}>{dateString}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  },
});
