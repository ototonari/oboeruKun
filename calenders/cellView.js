import React, { Component } from 'react';
import { Animated, Text, View, TouchableOpacity, TouchableHighlight, Image, TextInput, Switch, StyleSheet, Picker, Platform } from 'react-native';
import Swipeable from 'react-native-swipeable';
import { setNotice } from "../database";
import { Actions, ActionConst } from "react-native-router-flux";



export default class CellView extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    
  }
  
  render() {
    let item = this.props.item
    const page = (item) => {
      if (item !== null) {
        return (<Text>Page: {item.startPage} ~ {item.endPage}</Text>)
      }
    }
    const memo = (item) => {
      if (item !== null) {
        return (<Text>メモ: {item}</Text>)
      }
    }
    //let { fadeAnim, offsetX } = this.state
    const success = () => {
      setNotice(0, item.noticeDate, item.id)
      let items = this.props.this.state.items
      //console.log('start: ', items[item.noticeDate][0])
      let spliceIndex
      for(let i=0, j=items[item.noticeDate].length; i < j; i++) {
        if(item.id == items[item.noticeDate][i].id) {
          //console.log('hit obj : ', items[item.noticeDate][i])
          spliceIndex = i
          i = j
        }
      }
      items[item.noticeDate].splice(spliceIndex, 1)
      //console.log('spliced : ', items[item.noticeDate])
      this.props.this.setState({ items })
    }

    const rightButtons = [
      <TouchableOpacity style={{
        backgroundColor: 'white',
        flex: 1,
        padding: 10,
        marginRight: 0,
        marginTop: 17,
        paddingLeft: 20,
        alignContent: 'center',
        justifyContent: 'center',
      }}
      onPress={() => success()}
      ><Image source={require('../assets/success.png')} style={{height: 30, width: 30}} /></TouchableOpacity>
    ];


    return (
      <Swipeable rightButtons={rightButtons} rightButtonWidth={70}  >
        <View style={[styles.item, {height: item.height}]}>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }} >{item.title}</Text>
          { page(item.page) }
          { memo(item.memo) }
        </View>
      </Swipeable>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    padding: 10,
    marginRight: 0,
    marginTop: 17
  },
  emptyDate: {
    flex:1,
    height: 10,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    marginTop: 17,
    backgroundColor: 'white',
  }
});