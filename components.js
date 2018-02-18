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
              <Image source={require('./assets/camera.png')} />
          )
      }
  }
}

export class FlatButton extends Component {
    constructor(props) {
        super(props)
    }

    style = StyleSheet.create({
        container: {
            borderColor: 'gray',
            borderBottomWidth: 1,
            height: 50,
        },
        inContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingLeft: 15,
            paddingRight: 15,
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        text: {
            fontSize: 20
        },
        image: {
            width: 20,
            height: 20
        }
    })
    render () {
        const text = this.props.text
        const func = this.props.function
        return (
            <TouchableOpacity 
                onPress={() => func()}
                style={this.style.container} >
                    <View style={this.style.inContainer} >
                        <Text style={this.style.text} >Developers</Text>
                        <Image source={require('./assets/right.png')} style={this.style.image} />
                    </View>
            </TouchableOpacity>
  
        )
    }
}