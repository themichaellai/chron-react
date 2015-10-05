'use strict';

var React = require('react-native');
var SectionPostListing = require('./SectionPostListing');

var Frontpage = React.createClass({
  render: function() {
    var section = {
      name: 'Frontpage',
      slug: 'frontpage',
    };
    return (
      <SectionPostListing
        section={section}
        navigator={this.props.navigator} />
    );
  },
});

module.exports = Frontpage;
