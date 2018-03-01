import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, Switch, Picker, Platform } from 'react-native';
import styles from "./registerStyle";
import { Dropdown } from 'react-native-material-dropdown';
import Modal from 'react-native-modal';
import { validation, registerTask, renderPageModalContent, renderTitleModalContent, arrangement } from "./registerAction";
import { createDB, getTitle } from "../database";

export default class RegisterView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: true,
      memo: false,
      memoValue: '',
      notice: true,
      visibleModal: null,
      startPage: '1',
      endPage: '1',
      title: '',
      titleError: '',
      titleList: [],
      titleIndex: null,
      noticeMethod: 'forgetting',
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
        <View style={{position: 'relative', alignContent: 'flex-end'}} >
          <TouchableOpacity onPress={() => this.setState({visibleModal: 3})} >
            <Image source={require('../assets/titleList.png')} style={styles.styles.titleListIcom} />
          </TouchableOpacity>
        </View>
          
      </View>
    </View>
  )

  _page = () => (
    <View style={styles.container.page} >
      <View style={styles.container.switch} >
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
      return 
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

  _memo = () => (
    <View style={styles.container.page} >
      <View style={styles.container.switch} >
        <Text style={styles.styles.titleLabel} >メモ</Text>
        <Switch
          onValueChange={() => this.setState({memo: !this.state.memo})}
          value={this.state.memo}
          
        />
      </View>
      { this._renderMemoInputBox() }
    </View>
  )

  _renderMemoInputBox = () => {
    if (this.state.memo == false) {
      return
    } else if (this.state.memo == true) {
      return (
        <View style={styles.container.boxContainer} >
          <TextInput 
            style={styles.styles.inputBox}
            multiline={true}
            maxLength={200}
            onChangeText={(text) => this.setState({memoValue: text})}
            value={this.state.memoValue}
              />
        </View>
      )
    }
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
    getTitle(this)
    console.log(this.props.data)
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
          <View style={styles.params.param} >
            { this._memo() }
          </View>
          <View style={styles.params.notice} >
            { this._notice() }
          </View>

        </View>
        <View style={styles.container.register} >
          { this._renderButton('登録',() => validation(this, arrangement) , styles.styles.registerButton) }
        </View>
        <Modal isVisible={this.state.visibleModal === 1}>
          { renderPageModalContent(this) }
        </Modal>
        <Modal isVisible={this.state.visibleModal === 2}>
          { renderPageModalContent(this) }
        </Modal>
        <Modal isVisible={this.state.visibleModal === 3}>
          { renderTitleModalContent(this) }
        </Modal>
        
        
        
      </View>
    )
  }
}