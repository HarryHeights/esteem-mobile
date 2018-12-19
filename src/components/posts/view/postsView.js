import React, { Component, Fragment } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { injectIntl } from 'react-intl';
import { withNavigation } from 'react-navigation';

// STEEM
import { getPostsSummary } from '../../../providers/steem/dsteem';

// COMPONENTS
import { PostCard } from '../../postCard';
import { FilterBar } from '../../filterBar';
import { PostCardPlaceHolder, NoPost } from '../../basicUIElements';

import filters from '../../../constants/options/filters.json';
// Styles
import styles from './postsStyles';
import { default as ROUTES } from '../../../constants/routeNames';

class PostsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      startAuthor: '',
      startPermlink: '',
      refreshing: false,
      isLoading: false,
      isPostsLoading: true,
      isHideImage: false,
      selectedFilterIndex: 0,
      isNoPost: false,
    };
  }

  componentDidMount() {
    this._loadPosts();
  }

  componentWillReceiveProps(nextProps) {
    const { currentAccountUsername } = this.props;

    if (
      currentAccountUsername !== nextProps.currentAccountUsername
      && nextProps.currentAccountUsername
    ) {
      // Set all initial data (New user new rules)
      this.setState(
        {
          posts: [],
          startAuthor: '',
          startPermlink: '',
          refreshing: false,
          isLoading: false,
          isPostsLoading: false,
          isHideImage: false,
          selectedFilterIndex: 0,
          isNoPost: false,
        },
        () => {
          this._loadPosts();
        },
      );
    }
  }

  _loadPosts = (filter = null) => {
    const { getFor, tag, currentAccountUsername } = this.props;
    const { posts, startAuthor, startPermlink } = this.state;
    let options;

    this.setState({ isLoading: true });

    if (!filter && tag) {
      options = {
        tag,
        limit: 3,
      };
    } else {
      options = {
        limit: 3,
      };
    }

    if (startAuthor && startPermlink) {
      options.start_author = startAuthor;
      options.start_permlink = startPermlink;
    }

    getPostsSummary(filter || getFor, options, currentAccountUsername)
      .then((result) => {
        if (result.length > 0) {
          let _posts = result;

          if (_posts.length > 0) {
            if (posts.length > 0) {
              _posts.shift();
              _posts = [...posts, ..._posts];
            }
            this.setState({
              posts: _posts,
              startAuthor: result[result.length - 1] && result[result.length - 1].author,
              startPermlink: result[result.length - 1] && result[result.length - 1].permlink,
              refreshing: false,
              isPostsLoading: false,
            });
          }
        } else if (result.length === 0) {
          this.setState({ isNoPost: true });
        }
      })
      .catch((err) => {
        this.setState({
          refreshing: false,
          isPostsLoading: false,
        });
      });
  };

  _handleOnRefreshPosts = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this._loadPosts();
      },
    );
  };

  _renderFooter = () => {
    const { isLoading } = this.state;

    if (isLoading) {
      return (
        <View style={styles.flatlistFooter}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }
    return null;
  };

  _handleOnDropdownSelect = (index) => {
    this.setState({
      isPostsLoading: true,
      selectedFilterIndex: index,
    });
    this._loadPosts(filters[index]);
  };

  _onRightIconPress = () => {
    const { isHideImage } = this.state;

    this.setState({ isHideImage: !isHideImage });
  };

  _handleOnScrollStart = () => {
    const { handleOnScrollStart } = this.props;
    handleOnScrollStart();
  };

  _handleOnPressLogin = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTES.SCREENS.LOGIN);
  };

  render() {
    const {
      refreshing,
      posts,
      isPostsLoading,
      isHideImage,
      selectedFilterIndex,
      isNoPost,
    } = this.state;
    const {
      filterOptions, intl, isLoggedIn, getFor, isLoginDone, tag,
    } = this.props;

    return (
      <Fragment>
        {filterOptions && (
          <FilterBar
            dropdownIconName="md-arrow-dropdown"
            options={filterOptions}
            selectedOptionIndex={0}
            defaultText={filterOptions[0]}
            rightIconName="view-module"
            rightIconType="MaterialIcons"
            onDropdownSelect={this._handleOnDropdownSelect}
            onRightIconPress={this._onRightIconPress}
          />
        )}
        <Fragment>
          {filters[selectedFilterIndex] === 'feed'
            && getFor === 'feed'
            && !isLoggedIn
            && isLoginDone && (
              <NoPost
                isButtonText
                defaultText={intl.formatMessage({
                  id: 'profile.login_to_see',
                })}
                handleOnButtonPress={this._handleOnPressLogin}
              />
          )}
        </Fragment>

        {posts && posts.length > 0 && !isPostsLoading ? (
          <FlatList
            data={posts}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <PostCard content={item} isHideImage={isHideImage} />}
            keyExtractor={(post, index) => index.toString()}
            onEndReached={() => this._loadPosts()}
            removeClippedSubviews
            refreshing={refreshing}
            onRefresh={() => this._handleOnRefreshPosts()}
            onEndThreshold={0}
            initialNumToRender={10}
            ListFooterComponent={this._renderFooter}
            onScrollBeginDrag={() => this._handleOnScrollStart()}
          />
        ) : isNoPost ? (
          <NoPost
            name={tag}
            text={intl.formatMessage({
              id: 'profile.havent_posted',
            })}
            defaultText={intl.formatMessage({
              id: 'profile.login_to_see',
            })}
          />
        ) : (
          <Fragment>
            <PostCardPlaceHolder />
            <PostCardPlaceHolder />
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default withNavigation(injectIntl(PostsView));
