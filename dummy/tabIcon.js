import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';

const styles = StyleSheet.create({
    tabText: {
        color: 'gray',
    },
    tabTextActive: {
        color: 'blue',
    },
    imageIcon: {
      width: 30,
      height: 30
    }
});


export default class TabIcon extends Component {
  constructor(props) {
    super(props)

  }

  managerIcon = (key, isFocused) => {
    if (key == 'manager') {
      if (isFocused == true) {
        return(
          <Image source={require('../assets/listIcon.png')} style={styles.imageIcon} />
        )
      } else {
        return(
          <Image source={require('../assets/listIcon2.png')} style={styles.imageIcon} />
        )
      }
    } else if (key == 'config') {
      if (isFocused == true) {
        return(
          <Image source={require('../assets/config.png')} style={styles.imageIcon} />
        )
      } else {
        return(
          <Image source={require('../assets/config2.png')} style={styles.imageIcon} />
        )
      }
    }
  }

  render () {
    const key = this.props.navigation.state.key
    const isFocused = this.props.focused
    return(
      <View>
        { this.managerIcon(key, isFocused) }
      </View>
    )
  }
}
