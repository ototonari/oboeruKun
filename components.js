import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';


export class Avatar extends Component {
  constructor(props) {
      super(props);
  }
  render() {
      if(this.props.source !== '') {
          let uri = this.props.source
          return (
              <Image source={{uri: uri}} style={this.props.style} />
          )
      } else {
          return (
              <Image source={require('./images/camera.png')} />
          )
      }
  }
}

