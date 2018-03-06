import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import Swipeable from 'react-native-swipeable';
import { getAllTitle, deleteList } from "../database";


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
      if (items.length == 0) { items = [{ title: '履歴はありません', id: 0 }] }
      this.setState({ items })
      console.log(items)
    }
    setItems()
  }

  _renderItems = (item) => {
    const deleteItem = (id) => {
      for (let i=0,j=this.state.items.length; i < j; i++) {
        const tmpItem = this.state.items[i]
        if (tmpItem.id == id) {
          console.log('hit : ', tmpItem)
          deleteList(id).then(() => {
            let newItems = this.state.items
            if (newItems.length > 0) {
              const spliceIndex = i
              newItems.splice(spliceIndex, 1)
            } else {
              newItems = [{ title: '履歴はありません', id: 0 }]
            }
            this.setState({ items: newItems })
          })
          break;
        }
      }
    }
    const rightButtons = [
      <TouchableOpacity style={styles.swipeButton}
        onPress={() => deleteItem(item.id)} >
        <Image source={require('../assets/error.png')} style={styles.image} />
      </TouchableOpacity>,
      
    ];

    return(
      <Swipeable rightButtons={rightButtons} rightButtonWidth={70}  >
        <View style={styles.container} >
          <Text style={{fontSize: 18, }} >{item.title}</Text>
        </View>
      </Swipeable>
    )
  }
  
  render () {
    return (
      <View style={styles.background} >
        <FlatList
          data={this.state.items}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => this._renderItems(item) }
          bounces={false}
        />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginLeft: 10,
    flex: 1,
    paddingLeft: 20,
    paddingTop: 7,
    paddingRight: 20,
    paddingBottom: 7,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  background: {
    backgroundColor: '#f1f1f1',
    flex: 1,
    paddingBottom: 10,
  },
  image: {
    width: 22,
    height: 22,
  },
  swipeButton: {
    backgroundColor: 'white',
    marginTop: 5,
    flex: 1,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 20,
    alignContent: 'center',
    justifyContent: 'center',
  }
})