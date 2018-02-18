import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
    tabText: {
        color: 'gray',
    },
    tabTextActive: {
        color: 'blue',
    },
});


export default class TabIcon extends Component {
  constructor(props) {
    super(props)

  }

  render () {
    //console.log(this.props)
    if (this.props.focused == true) {
      return(<Text>focused = true</Text>)
    } else {
      return(<Text>focused = false</Text>)
    }
  }
}
