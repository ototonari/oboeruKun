import React, { Component}  from 'react'
import {
keyboardAvoidingView,
Keyboard,
StatusBar,
StyleSheet,
TextInput,
View,
} from 'react-native';

export default class KeyboardAvoid extends Component {
  constructor(props){
    super(props)
    this.state ={
      behavior: 'position',
    }
    //this._keyboardDismiss =  this._keyboardDismiss.bind(this);
  }
  componentWillMount() {
    this.keyboardDidHideListener = 
      Keyboard
      .addListener('keyboardDidHide',this._keyboardDidHide);                                                         
  }

  componentWillUnmount(){
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidHide() {
    Keyboard.dismiss();
  }

  render() {

  return (
    <KeyboardAvoidingView 
      style={{flex:1}}
      behavior={this.state.behavior}
    >
    <TouchableOpacity
      onPress={this._keyboardDidHide}
    >
    <View>
      <TextInput
          style={{
          color: '#000',
          paddingLeft: 15,
          paddingTop: 10,
          fontSize: 18,t}}
          multiline={true}
          textStyle={{ fontSize: '20', fontFamily: 'Montserrat-Medium' }}
          placeholder="Share your Success..."
          value={this.state.text}
          underlineColorAndroid="transparent"
          returnKeyType={'default'}
      />
    </View>
    </TouchableOpacity>

    </KeyboardAvoidingView>
  );
 }
}