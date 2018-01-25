import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, Switch, Picker, Platform } from 'react-native';
import styles from "./registerStyle";
import { Dropdown } from 'react-native-material-dropdown';
import Modal from 'react-native-modal';
import { validation, registerTask } from "./registerAction";
import { createDB } from "../database";

export default class RegisterView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: true,
      notice: true,
      visibleModal: null,
      startPage: '1',
      endPage: '1',
      title: '',
      titleError: '',
      noticeMethod: 'forgetting',

    }
  }

  _renderButton = (text, onPress, style) => (
    <TouchableOpacity onPress={onPress}>
      <View style={style}>
        <Text style={styles.styles.registerText} >{text}</Text>
      </View>
    </TouchableOpacity>
  );

  _title = () => (
    <View style={styles.container.title} >
      <View style={{ flex: 1 }} >
        <Text style={styles.styles.titleLabel} >タイトル</Text>
        <Text style={{ color: 'red' }} >{ this.state.titleError }</Text>
        <TextInput
          style={styles.styles.titleInputBox}
          onChangeText={(text) => this.setState({title: text})}
          value={this.state.title} />
      </View>
    </View>
  )

  _page = () => (
    <View style={styles.container.page} >
      <View style={styles.container.pageSwitch} >
        <Text style={styles.styles.titleLabel} >ページ範囲</Text>
        <Switch
          onValueChange={() => this.setState({page: !this.state.page})}
          value={this.state.page}
          
        />
      </View>
      { this._renderPagePicker() }
    </View>
  )

  _renderPagePicker = () => {
    if (this.state.page == false) {
      return (<Text></Text>)
    } else if (this.state.page == true) {
      return (
        <View style={styles.container.pageSet}  >
          <TouchableOpacity onPress={() => {if(this.state.page === true){this.setState({visibleModal: 1})}} }>
            <View style={styles.styles.pageButton}>
              <Text style={styles.styles.pageText} >p.{this.state.startPage}</Text>
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, marginLeft: 30, marginRight: 30 }} >〜</Text>
          <TouchableOpacity onPress={() => {if(this.state.page === true){this.setState({visibleModal: 2})}} }>
            <View style={styles.styles.pageButton}>
              <Text style={styles.styles.pageText} >p.{this.state.endPage}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
  }

  _renderPickerItems = () => {
    const srvItems = []
    for (let i = 1; i <= 500 ; i++){
      srvItems.push(<Picker.Item key={String(i)} label = {String(i)} value = {String(i)} />)
    }
    return srvItems
  }

  _renderModalContent = () => {
    let func = null
    let selected = null
    if (this.state.visibleModal === 1) {
      func = (page) => {
        this.setState({startPage: page})
        this.setState({endPage: page})
      }
      selected = this.state.startPage
    } else if (this.state.visibleModal === 2) {
      func = (page) => {
        if (Number(page) < Number(this.state.startPage)) {
          page = this.state.startPage
        }
        this.setState({endPage: page})
      }
      selected = this.state.endPage
    }
    return (
      <View style={styles.container.pageModal} >
        <Picker onValueChange={ (page) => func(page)} selectedValue = {selected} >
          { this._renderPickerItems() }
        </Picker>
        <TouchableOpacity onPress={() => this.setState({visibleModal: null})}>
          <View style={styles.styles.modalButton}>
            <Text style={styles.styles.registerText} >決定</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  _notice = () => {
    let data = [
      {
        value: '忘却曲線に基づいた通知',
        key: 'forgetting',
      }
    ];

    return (
    <View  >
      <Dropdown
        label='通知方法'
        data={data}
        value={data[0].value}
        onChangeText={ (value, index, data) => {this.setState({noticeMethod: data[index].key}); console.log(value + index + data[index].key) }}
      />
    </View>
    )
  }

  componentDidMount() {
    createDB()
  }

  render () {
    return (
      <View style={styles.container.container} >
        <View style={styles.container.view} >
          <View style={styles.params.title} >
            { this._title() }
          </View>

          <View style={styles.params.param} >
            { this._page() }
          </View>
          <View style={styles.params.notice} >
            { this._notice() }
          </View>

        </View>
        <View style={styles.container.register} >
          { this._renderButton('登録',() => validation(this, registerTask) , styles.styles.registerButton) }
        </View>
        <Modal isVisible={this.state.visibleModal === 1}>
          { this._renderModalContent() }
        </Modal>
        <Modal isVisible={this.state.visibleModal === 2}>
          { this._renderModalContent() }
        </Modal>
      </View>
    )
  }
}