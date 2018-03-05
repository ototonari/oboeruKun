import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { getAllTitle } from "../database";


export default class TitleList extends Component {
  constructor (props) {
    super (props)
    this.state = {
      items: []
    }
  }

  componentDidMount() {
    const setItems = async () => {
      let items = []
      items = await getAllTitle()
      this.setState({ items })
      console.log(items)
    }
    setItems()
  }
  
  render () {
    return (
      <View  >
        <FlatList
          data={this.state.items}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => <Text>{item.title}</Text>}
        />
      </View>
    )
  }

}