import React, { Component } from 'react';
import { connect } from 'react-redux';

// Services and Actions

// Middleware

// Constants

// Utilities

// Component
import FeedbackScreen from '../screen/feedbackScreen';

/*
 *            Props Name        Description                                     Value
 *@props -->  props name here   description here                                Value Type Here
 *
 */

class FeedbackContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Component Life Cycle Functions

  // Component Functions

  render() {
    return <FeedbackScreen />;
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(FeedbackContainer);
