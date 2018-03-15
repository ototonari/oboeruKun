import React, { Component } from 'react';
import { Alert, Text, TextInput, View, TouchableOpacity, Image, FlatList, StyleSheet, ScrollView, Picker } from 'react-native';
import Swipeable from 'react-native-swipeable';
import Modal from 'react-native-modal';
import { Actions, ActionConst } from "react-native-router-flux";
import { getAllParams, deleteList, insertNoticeInterval, deleteParams } from "../database";
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
      deleteParams('noticeInterval', id)
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
    msg += 'に復習する'

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
      title: '',
      titleError: '',
      intervalDay: 1,
      items: [],
      selected: 1,
      visibleModal: null,
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
          onChangeText={(text) => this.setState({title: text, titleError: ''})}
          value={this.state.title}
          maxLength={30} />          
      </View>
    </View>
  )

  _addItem = () => (
    <View style={localStyles.form} >
      <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', marginLeft: 20 }} >
          <TouchableOpacity onPress={() => this.setState({ visibleModal: 1 }) }>
            <View style={localStyles.modalButton}>
              <Text style={styles.styles.pageText} >{ this.state.intervalDay }</Text>
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 16, marginLeft: 10 }} >日後に通知する</Text>
      </View>
      <TouchableOpacity 
        onPress={() => {addItem(this)} } >
        <Image source={require('../assets/plus.png')} style={{ width: 30, height: 30, marginRight: 20}} />
      </TouchableOpacity>
    </View>
  )

  _renderItems = (item) => {

    return(
        <View style={[localStyles.rowItem, localStyles.container, {justifyContent: 'space-between'}]} >
          <Text style={{fontSize: 18, }} >{item.day} 日後に通知する</Text>
          <TouchableOpacity
            onPress={() => {deleteItem(this, item.id)}} >
            <Image source={require('../assets/error.png')} style={[localStyles.image, {marginRight: 20}]} />
          </TouchableOpacity>
        </View>
    )
  }

  _renderModal = () => (
    <TouchableOpacity style={{
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center'
    }}
    disabled={(this.state.visibleModal === 1) ? false : true }
    onPress={() => this.setState({ visibleModal: null })} accessible={false} >
    <View style={styles.container.pageModal} >
      <Picker onValueChange={(value, index) => {
        this.setState({ intervalDay: value })
      } } 
      selectedValue={ this.state.intervalDay } 
      style={{ width: '100%', flex: 0.6 }} >
        { this._renderPickerItems() }
      </Picker>
    </View>
    </TouchableOpacity>
  )  


  _renderPickerItems = () => {
    const srvItems = []
    for (let i = 1; i <= 50 ; i++){
      srvItems.push(<Picker.Item key={String(i)} label = {String(i)} value = {String(i)} />)
    }
    return srvItems
  }

  render () {
    return (
      <View style={styles.container.container} >
        <View style={styles.container.view} >
          <View style={styles.params.title} >
            { this._title() }
          </View>
          <View style={styles.params.param} >
            { this._addItem() }
          </View>
          <View style={localStyles.background} >
            <FlatList
              data={this.state.items}
              extraData={this.state}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => this._renderItems(item) }
            />
          </View>
          </View>
        <View style={styles.container.register} >
          { this._renderButton('登録',() => validation(this) , styles.styles.registerButton) }
        </View>
        <Modal isVisible={this.state.visibleModal === 1}>
          { this._renderModal() }
        </Modal>
      </View>
    )
  }
}

function addItem(target) {
  const intervalDay = target.state.intervalDay
  let items = target.state.items
  console.log('items: ',items)
  const id = items.length
  const item = {
    id: id,
    day: intervalDay
  }
  items.push(item)
  target.setState({ items, selected: target.state.selected++ })
}

function deleteItem(target, id) {
  let items = target.state.items
  items.splice(id, 1)
  for (let i=0,j=items.length; i < j; i++) {
    items[i].id = i
  }
  target.setState({ items })
}

function validation(target) {
  const title = target.state.title
  const items = target.state.items
  let error = ''
  if (title == '') error += 'タイトルを入力してください。'
  if (items.length == 0) error += '通知間隔を追加してください。'
  if (error !== '') {
    // error
    target.setState({ titleError: error })
    return
  } else {
    // success
    addNoticeInterval(items, title)
  }
}

async function addNoticeInterval(list, name) {
  const items = list
  const makeIntervalList = async () => {
    let intervalList = []
    for (let i=0,j=items.length; i < j; i++) {
      intervalList.push(items[i].day)
    }
    return intervalList
  }
  makeIntervalList().then(async (intervalList) => {
    await insertNoticeInterval(intervalList, name)
    Alert.alert(
      '登録しました','',
      [{text: 'OK', onPress: () => {
        Actions.reset('tabbar')
      } }]
    )  
  })
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
  rowItem: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center'
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
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderColor: 'gray',
    borderBottomWidth: 1,
  },
  modalButton: {
    backgroundColor: 'powderblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    width: 50,
    height: 40,
  }
})