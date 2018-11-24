import React, { Component } from 'react';
import { connect } from 'react-redux';

// Services and Actions
import { search } from '../../../providers/esteem/esteem';
import { lookupAccounts } from '../../../providers/steem/dsteem';

// Middleware

// Constants
import { default as ROUTES } from '../../../constants/routeNames';

// Utilities

// Component
import { SearchView } from '..';

/*
  *            Props Name        Description                                     Value
  *@props -->  props name here   description here                                Value Type Here
  *
  */

class SearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: {},
    };
  }

  // Component Life Cycle Functions

  // Component Functions
  _handleCloseButton = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  _handleOnChangeSearchInput = (text) => {
    if (text && text !== '@') {
      if (text[0] === '@') {
        lookupAccounts(text.substr(1)).then((res) => {
          const users = res.map(item => ({ author: item }));
          this.setState({ searchResults: { type: 'user', data: users } });
        });
      } else {
        search({ q: text }).then((res) => {
          res.results = res.results.filter(item => item.title !== '');
          this.setState({ searchResults: { type: 'content', data: res.results } });
        });
      }
    }
  };

  _handleOnPressListItem = (type, item) => {
    const { navigation } = this.props;
    if (type === 'user') {
      navigation.navigate({
        routeName: ROUTES.SCREENS.PROFILE,
        params: {
          username: item.author,
        },
        key: item.author,
      });
    } else if (type === 'content') {
      navigation.navigate({
        routeName: ROUTES.SCREENS.POST,
        params: {
          author: item.author,
          permlink: item.permlink,
        },
        key: item.permlink,
      });
    }
  };

  render() {
    const { searchResults } = this.state;

    return (
      <SearchView
        searchResults={searchResults}
        handleCloseButton={this._handleCloseButton}
        handleOnChangeSearchInput={this._handleOnChangeSearchInput}
        handleOnPressListItem={this._handleOnPressListItem}
      />
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(SearchContainer);
