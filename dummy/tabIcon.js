import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';


export default class TabIcon extends Component {
  constructor(props) {
    super(props)

  }

  managerIcon = (key, isFocused) => {
    if (key == 'manager') {
      if (isFocused == true) {
        return(
          <Image source={require('../assets/iconList.png')} style={styles.imageIcon} />
        )
      } else {
        return(
          <Image source={require('../assets/iconList2.png')} style={styles.imageIcon} />
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
      <View style={styles.view} >
        { this.managerIcon(key, isFocused) }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tabText: {
      color: 'gray',
  },
  tabTextActive: {
      color: 'blue',
  },
  imageIcon: {
    width: 25,
    height: 25,
    marginBottom: 5,
  },
  view: {
    flex:1,
    flexDirection:'column', 
    alignItems:'center', 
    alignSelf:'center', 
    justifyContent: 'center'
  }
});
