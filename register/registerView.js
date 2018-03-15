import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, Switch, ScrollView, Picker, Platform, Keyboard } from 'react-native';
import { isEqual } from "lodash";
import styles from "./registerStyle";
import { Dropdown } from 'react-native-material-dropdown';
import Modal from 'react-native-modal';
import { validation, registerTask, renderPageModalContent, renderTitleModalContent, arrangement, testRenderPageModalContent } from "./registerAction";
import { createDB, getTitle, getAllParams } from "../database";

export default class RegisterView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: true,
      memo: false,
      memoValue: '',
      visibleModal: null,
      startPage: '1',
      endPage: '1',
      title: '',
      titleError: '',
      titleList: [],
      titleIndex: null,
      repeat: true,
      notice: false,
      intervalList: [],
      repeatId: 1,
      repeatName: '',
      keyboardHidden: true,
    }
  }

    shouldComponentUpdate(nextProps, nextState) {
      return !(
        this.state.memo === nextState.memo &&
        this.state.memoValue === nextState.memoValue &&
        this.state.page === nextState.page &&
        this.state.repeat === nextState.repeat &&
        this.state.notice === nextState.notice &&
        this.state.visibleModal === nextState.visibleModal &&
        this.state.title === nextState.title &&
        this.state.startPage === nextState.startPage &&
        this.state.endPage === nextState.endPage &&
        isEqual(nextState.intervalList, this.state.intervalList) &&
        isEqual(nextProps, this.props)
      )
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
      <View style={{ flex: 1, borderColor: 'pink', borderWidth: 0 }} >
        <TextInput
          style={styles.styles.titleInputBox}
          onChangeText={(text) => this.setState({title: text})}
          value={this.state.title}
          maxLength={200}
          underlineColorAndroid={'white'}
           />
        <View style={{ position: 'absolute', top: 3, right: 5, overflow: 'visible' }} >
          <TouchableOpacity 
            onPress={() => this.setState({visibleModal: 3})}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          >
            <Image source={require('../assets/modalButton.png')} style={styles.styles.titleListIcom} />
          </TouchableOpacity>
        </View>
          
      </View>
    </View>
  )

  _renderTitleModal = () => (
    <TouchableOpacity style={{
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      zIndex: 0,
    }}
    disabled={(this.state.visibleModal === 3) ? false : true }
    onPress={() => this.setState({ visibleModal: null })} accessible={false}
     >
    <View style={[styles.container.pageModal, ]} >
    <TouchableOpacity style={[styles.container.pageModal, {zIndex: 1, flex: 1}]} >
    { Platform.select({
        ios: (
          <Picker onValueChange={(value, index) => this.setState({ title: value }) } 
            selectedValue={ this.state.title } 
            style={{ width: '100%', flex: 0.6 }} >
              { this._renderTitlePickerItems(this.state.titleList) }
          </Picker>
        ),
        android: (
          <Picker onValueChange={(value, index) => this.setState({ title: value }) } 
            selectedValue={ this.state.title } 
            style={{ width: '100%', flex: 0.6, zIndex: 10 }} 
            hitSlop={{top: 100, bottom: 100, left: 100, right: 100}}
          >
              { this._renderTitlePickerItems(this.state.titleList) }
          </Picker>
        ),
      })}
      </TouchableOpacity>
    </View>
    </TouchableOpacity>
  )

  _renderTitlePickerItems = (array) => {
    const srvItems = []
    srvItems.push(<Picker.Item key={-1} label = {'選択してください'} value = {''} />)
    array.forEach( (value, index) => {
      srvItems.push(<Picker.Item key={index} label = {String(value.title)} value = {String(value.title)} />)
    })
    return srvItems
  }
  

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

  _renderPageModal = () => (
    <TouchableOpacity style={{
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      zIndex: 0
    }}
    disabled={(this.state.visibleModal === 1 || this.state.visibleModal === 2) ? false : true }
    onPress={() => this.setState({ visibleModal: null })} accessible={false} >
    <View style={styles.container.pageModal} >
    <TouchableOpacity style={[styles.container.pageModal, {zIndex: 1, flex: 1}]} >
      <Picker onValueChange={(value, index) => {
        if(this.state.visibleModal === 1) {
          if (Number(value) > Number(this.state.endPage)) {
          this.setState({startPage: value, endPage: value})
          } else {
            this.setState({ startPage: value })
          }
        }
        if(this.state.visibleModal === 2) {
          if (!(Number(value) < Number(this.state.startPage))) {
            this.setState({ endPage: value })
          }
        }
      } } 
      selectedValue={ (this.state.visibleModal === 1) ? this.state.startPage : this.state.endPage } 
      style={{ width: '100%', flex: 0.6 }} 
      hitSlop={{top: 100, bottom: 100, left: 100, right: 100}}
      >
        { this._renderPickerItems() }
      </Picker>
      </TouchableOpacity>
    </View>
    </TouchableOpacity>
  )  
  

  _renderPickerItems = (modalNumber) => {
    const srvItems = []
    for (let i = 1; i <= 500 ; i++){
      srvItems.push(<Picker.Item key={String(i)} label = {String(i)} value = {String(i)} />)
    }
    return srvItems
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
            maxLength={400}
            onChangeText={(text) => this.setState({memoValue: text})}
            value={this.state.memoValue}
              />
        </View>
      )
    }
  }

  _repeat = () => (
    <View style={styles.container.page} >
      <View style={styles.container.switch} >
        <Text style={styles.styles.titleLabel} >反復学習</Text>
        <Switch
          onValueChange={() => this.setState({repeat: !this.state.repeat})}
          value={this.state.repeat}
          
        />
      </View>
      { this._notice() }
      { this._renderRepeatList() }
    </View>
  )

  _renderRepeatList = () => {
    if (this.state.repeat == false) return

    let data = []
    if (this.state.intervalList.length > 0) {
      for (let i=0,j=this.state.intervalList.length; i < j; i++) {
        const name = this.state.intervalList[i].name
        const id = this.state.intervalList[i].id
        data.push({
          id: id,
          value: name,
        })
      }
    }

    return (
    <View  >
      <Dropdown
        label='反復方法'
        data={data}
        value={this.state.repeatName}
        onChangeText={ (value, index, data) => {
          this.setState({ repeatId: data[index].id, repeatName: value })
          //console.log(`id: ${data[index].id}  value: ${value}`)
        }}
      />
    </View>
    )
  }

  _notice = () => {
    if (this.state.repeat === false) return
    return (
      <View style={styles.container.page} >
        <View style={styles.container.subContents} >
          <Text style={styles.styles.subTitleLabel} >・通知する</Text>
          <Switch
            onValueChange={() => this.setState({notice: !this.state.notice})}
            style={{ transform: [{ scaleX: .9 }, { scaleY: .9 }] }}
            value={this.state.notice}
          />
        </View>
      </View>
  )}

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  
  componentDidMount() {
    getTitle(this)
    const setInterval = async () => {
      let intervalList
      intervalList = await getAllParams('id, name', 'noticeInterval')
      console.log('intervalList : ', intervalList)
      this.setState({ intervalList, repeatName: intervalList[0].name, repeat: true })
    }
    setInterval()
  }

  _keyboardDidShow () {
    console.log('Keyboard Shown');
    this.setState({ keyboardHidden: false })
  }

  _keyboardDidHide () {
    console.log('Keyboard Hidden');
    this.setState({ keyboardHidden: true })
  }


  render () {
    return (
      // 画面全体に判定を持ち、条件に応じて処理する。
      <TouchableOpacity style={styles.container.modalBackground}
        disabled={this.state.keyboardHidden}
        onPress={Keyboard.dismiss} accessible={false} >

      <View style={styles.container.container} >
        <View style={styles.container.view} >
          <ScrollView style={{ flex: 1 }} >
            <View style={styles.params.title} >
              { this._title() }
            </View>

            <View style={styles.params.param} >
              { this._page() }
            </View>
            <View style={styles.params.param} >
              { this._memo() }
            </View>
            <View style={styles.params.param} >
              { this._repeat() }
            </View>

            <View style={styles.container.blank} >
              
            </View>
          </ScrollView>
        </View>
        <View style={styles.container.register} >
          { this._renderButton('登録',() => validation(this, arrangement) , styles.styles.registerButton) }
        </View>
        <Modal isVisible={this.state.visibleModal === 1}>
          { this._renderPageModal() }
        </Modal>
        <Modal isVisible={this.state.visibleModal === 2}>
          { this._renderPageModal() }
        </Modal>
        <Modal isVisible={this.state.visibleModal === 3}>
          { this._renderTitleModal() }
        </Modal>
        
        
        
      </View>
      </TouchableOpacity>
    )
  }
}