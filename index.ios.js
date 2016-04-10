const React = require('react-native');
const {
  AppRegistry,
  Linking,
  Navigator,
  PushNotificationIOS,
  StyleSheet,
  StatusBarIOS,
  TabBarIOS,
} = React;

const _ = require('underscore');
const URL = require('url-parse');

const Frontpage = require('./src/Frontpage');
const LinksListing = require('./src/LinksListing');
const PostDetailLoader = require('./src/PostDetailLoader');
const Sections = require('./src/Sections');

const NavigationActionCreators = require('./src/actions/NavigationActionCreators');
const PostActionCreators = require('./src/actions/PostActionCreators');

const { NavigationBarRouteMapper } = require('./src/NavigationBarRouteMapper.ios');

const { registerPushIOS } = require('./src/PushNotification');

const store = require('./src/store');
const tabCursor = store.select('views', 'tab');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
  navigator: {
    height: 64,
    backgroundColor: '#f8f8f8',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  innerComponent: {
    flex: 1,
  },
  navBar: {
    backgroundColor: '#083e8c',
    flex: 1,
    flexDirection: 'row',
  },
});

const chronreact = React.createClass({
  getInitialState() {
    return {
      selectedTab: tabCursor.get(),
    };
  },

  componentDidMount() {
    tabCursor.on('change', this.updateTab);
    StatusBarIOS.setStyle('light-content');
    Linking.addEventListener('url', this._handleOpenURL);

    const url = this.props.pushNotification;
    if (!(_.isUndefined(url) || _.isNull(url))) {
      const slug = url.replace(/dukechronicle:\/\//, '')
        .replace(/\/article\//, '');
      this.openPost(slug);
    }

    Linking.getInitialURL().then((url) => {
      if (!_.isNull(url)) {
        const slug = url.replace(/dukechronicle:\/\//, '')
          .replace(/\/article\//, '');
        this.openPost(slug);
      }
    });
    registerPushIOS();
    PushNotificationIOS.addEventListener('notification', this.onNotification);
  },

  componentWillUnmount() {
    tabCursor.off('change', this.updateTab);
    Linking.removeEventListener('url', this._handleOpenURL);
    PushNotificationIOS.removeEventListener('notification', this.onNotification);
  },

  _handleOpenURL(e) {
    const url = e.url;
    if (!_.isNull(url)) {
      const slug = url.replace(/dukechronicle:\/\//, '')
        .replace(/\/article\//, '');
      this.openPost(slug);
    }
  },

  /*
   * Expects notification object to have a '_data' key that maps to an object,
   * which should have 'pushNotification' as a key, which should map to a full url.
   */
  onNotification(notification) {
    const url = notification._data.pushNotification;
    if (!(_.isUndefined(url) || _.isNull(url))) {
      const slug = url.replace(/dukechronicle:\/\//, '')
        .replace(/\/article\//, '');
      this.openPost(slug);
    }
  },

  updateTab() {
    this.setState({
      selectedTab: tabCursor.get(),
    });
  },

  tabIsSelected(name) {
    return this.state.selectedTab === name;
  },

  switchTabHandler(name) {
    return () => {
      NavigationActionCreators.selectSection(name);
      this.setState({selectedTab: name});
    };
  },

  openPost(slug) {
    PostActionCreators.getPost(slug);
    this.refs.frontpageNav.push({
      title: '',
      component: PostDetailLoader,
      passProps: {
        slug,
      },
    });
  },

  renderScene: function(route, navigator) {
    return (
      <route.component
        navigator={navigator}
        {...route.passProps} />
    );
  },

  renderNavigationBar: function() {
    return (
      <Navigator.NavigationBar
        routeMapper={NavigationBarRouteMapper}
        style={styles.navBar}
      />
    );
  },

  render: function() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
            title="Main"
            selected={this.tabIsSelected('frontpage')}
            icon={{uri: 'newspaper', scale: 3}}
            onPress={this.switchTabHandler('frontpage')} >
          <Navigator
            ref="frontpageNav"
            style={styles.container}
            barTintColor="#083e8c"
            tintColor="#eee"
            titleTextColor="#eee"
            initialRoute={{
              title: 'The Chronicle',
              component: Frontpage,
              titleStyleOverride: {
                fontFamily: 'Didot',
                fontSize: 20,
              },
            }}
            navigationBar={this.renderNavigationBar()}
            renderScene={this.renderScene} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
            title="Sections"
            selected={this.tabIsSelected('sections')}
            icon={{uri: 'sections', scale: 3}}
            onPress={this.switchTabHandler('sections')} >
          <Navigator
            style={styles.container}
            barTintColor="#083e8c"
            tintColor="#eee"
            titleTextColor="#eee"
            navigationBar={this.renderNavigationBar()}
            renderScene={this.renderScene}
            initialRoute={{
              title: 'Sections',
              component: Sections,
            }} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
            title="Links"
            selected={this.tabIsSelected('links')}
            icon={{uri: 'link', scale: 3}}
            onPress={this.switchTabHandler('links')} >
          <Navigator
            style={styles.container}
            barTintColor="#083e8c"
            tintColor="#eee"
            titleTextColor="#eee"
            navigationBar={this.renderNavigationBar()}
            renderScene={this.renderScene}
            initialRoute={{
              title: 'Links',
              component: LinksListing,
            }} />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  },
});

AppRegistry.registerComponent('chronreact', () => chronreact);
