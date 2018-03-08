import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity, Image, FlatList, StyleSheet, ScrollView } from 'react-native';
import Swipeable from 'react-native-swipeable';
import { getAllParams, deleteList } from "../database";
import styles from "../register/registerStyle";

export class NoticeSetting extends Component {
  constructor (props) {
    super (props)
    this.state = {
      items: []
    }
  }

  componentDidMount() {
    const setItems = async () => {
      let items = []
      items = await getAllParams('id, name, interval', 'noticeInterval')
      console.log('intervalList : ', items)
      this.setState({ items })
    }
    setItems()
  }

  _renderItems = (item) => {
    const deleteItem = (id) => {
      if (id === 1) return
      for (let i=0,j=this.state.items.length; i < j; i++) {
        const tmpItem = this.state.items[i]
        if (tmpItem.id == id) {
          console.log('hit : ', tmpItem)
          deleteList(id).then(() => {
            let newItems = this.state.items
            if (newItems.length > 1) {
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
      <TouchableOpacity style={localStyles.swipeButton}
        onPress={() => deleteItem(item.id)} >
        <Image source={require('../assets/error.png')} style={localStyles.image} />
      </TouchableOpacity>,
    ];

    let msg = ''
    const array = JSON.parse(item.interval)
    for (let i=0,j=array.length; i < j; i++) {
      msg += `${array[i]}日後, `
    }
    msg += 'に通知する'

    return(
      <Swipeable rightButtons={rightButtons} rightButtonWidth={70}  >
        <View style={localStyles.container} >
          <Text style={{fontSize: 18, }} >{item.name}</Text>
          <Text style={{fontSize: 14,paddingLeft: 10 }} >{msg}</Text>
        </View>
      </Swipeable>
    )
  }
  
  render () {
    return (
      <View style={localStyles.background} >
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

export class RegisterSetting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: ''
    }
  }

  _renderButton = (text, onPress, style) => (
    <TouchableOpacity onPress={onPress}>
      <View style={style}>
        <Text style={styles.styles.registerText} >{text}</Text>
      </View>
    </TouchableOpacity>
  )


  _title = () => (
    <View style={styles.container.title} >
      <View style={{ flex: 1 }} >
        <Text style={styles.styles.titleLabel} >タイトル</Text>
        <Text style={{ color: 'red' }} >{ this.state.titleError }</Text>
      </View>
      <View style={{ flex: 1 }} >
        <TextInput
          style={styles.styles.titleInputBox}
          onChangeText={(text) => this.setState({title: text})}
          value={this.state.title}
          maxLength={200} />          
      </View>
    </View>
  )

  render () {
    return (
      <View style={styles.container.container} >
        <View style={styles.container.view} >
          <View style={styles.params.title} >
            { this._title() }
          </View>
          <ScrollView style={{ flex: 1 }} >

            <View style={styles.params.param} >
            </View>
            <View style={styles.container.blank} >
              
            </View>
          </ScrollView>
        </View>
        <View style={styles.container.register} >
          { this._renderButton('登録',() => console.log('registerButton pressed') , styles.styles.registerButton) }
        </View>        
      </View>
    )
  }
}

const localStyles = StyleSheet.create({
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