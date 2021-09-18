import React, {Component} from 'react';
import {
  Alert,
  Image,
  Keyboard, Picker,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import {Icons} from "../../Config/Assets";
import Modal from "react-native-modal";
import {locale} from "../../Config/Locale";
import {getNoticeIntervals, getTitlesAsync} from "../../IO/SQLite";
import {CheckIcon, Select} from "native-base";
import {IRemindUsageSituation, Remind, remindService, remindUsageSituationDto, RepeatSetting} from "./lib";
import {resetToHome} from "../../Config/RouterLib";

enum VISIBLE_MODAL {
  DEFAULT,
  TITLE,
  PAGE_START,
  PAGE_END
}

interface SRemindMe extends IRemindUsageSituation {
  remind: Remind;
  repeatSetting: RepeatSetting;
  visibleModal: VISIBLE_MODAL;
  recordedTitles: string[];
  keyboardHidden: boolean; // TODO
  titleError: string; // TODO
}

export default class RemindMe extends Component<{}, SRemindMe> {
  keyboardWillHideListener: any
  keyboardDidHideListener: any
  constructor(props: any) {
    super(props);

    this.state = {
      remind: new Remind(),
      repeatSetting: new RepeatSetting(),
      visibleModal: VISIBLE_MODAL.DEFAULT,
      canUseRange: true,
      canUseMemo: false,
      recordedTitles: [],
      isRepeatable: false,
      isNotice: false,
      titleError: "",
      keyboardHidden: true,
    };
  }

  componentDidMount() {
    getTitlesAsync().then((titles) => this.setState({
      recordedTitles: titles
    }))

    getNoticeIntervals().then((noticeIntervals) => {
      const repeatSetting = new RepeatSetting({
        ownSettings: noticeIntervals,
      })

      this.setState({
        repeatSetting: repeatSetting,
        isRepeatable: true
      })
    })

    this.keyboardWillHideListener = Keyboard.addListener(
      "keyboardWillHide",
      this._keyboardWillHide.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide.bind(this)
    );
  }

  onRegister = () => {
    const {remind, repeatSetting} = this.state;

    if (remind.isValid()) {
      const dto = remindUsageSituationDto(this.state);
      remindService(remind, repeatSetting, dto).then(() => {
        Alert.alert(locale.data.done, "", [
          {
            text: "OK",
            onPress: () => {
              resetToHome(this.props.navigation);
            },
          },
        ]);
      })
    } else {
      this.setState({ titleError: locale.register.errTitle });
    }
  }

  _renderButton = (text: string, onPress: any, style: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={style}>
        <Text style={styles.styles.registerText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  _title = () => (
    <View style={styles.container.title}>
      <View style={{ flex: 1 }}>
        <Text style={styles.styles.titleLabel}>{locale.register.title}</Text>
        <Text style={{ color: "red" }}>{this.state.titleError}</Text>
      </View>
      <View style={{ flex: 1, borderColor: "pink", borderWidth: 0 }}>
        <TextInput
          style={styles.styles.titleInputBox}
          onChangeText={(text) => this.setState({
            remind: this.state.remind.setTitle(text),
            titleError: ""
          })}
          value={this.state.remind.title}
          maxLength={200}
          underlineColorAndroid={"white"}
        />
        <View
          style={{
            position: "absolute",
            top: 3,
            right: 5,
            overflow: "visible",
          }}
        >
          <TouchableOpacity
            onPress={() => this.setState({ visibleModal: VISIBLE_MODAL.TITLE })}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              // eslint-disable-next-line no-undef
              source={Icons.remind.modalButton}
              style={styles.styles.titleListIcom}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  _renderTitleModal = () => (
    <TouchableOpacity
      style={{
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        zIndex: 0,
      }}
      disabled={this.state.visibleModal !== VISIBLE_MODAL.TITLE}
      onPress={() => this.setState({ visibleModal: VISIBLE_MODAL.DEFAULT })}
      accessible={false}
    >
      <View style={[styles.container.pageModal]}>
        <TouchableOpacity
          style={[styles.container.pageModal, { zIndex: 1, flex: 1 }]}
        >
          {Platform.select({
            ios: (
              <Picker
                onValueChange={(text) => this.setState({
                  remind: this.state.remind.setTitle(text)
                })}
                selectedValue={this.state.remind.title}
                style={{ width: "100%", flex: 0.6 }}
              >
                {this._renderTitlePickerItems(this.state.recordedTitles)}
              </Picker>
            ),
            android: (
              <Picker
                onValueChange={(text) => this.setState({
                  remind: this.state.remind.setTitle(text)
                })}
                selectedValue={this.state.remind.title}
                style={{ width: "100%", flex: 0.6, zIndex: 10 }}
                hitSlop={{ top: 100, bottom: 100, left: 100, right: 100 }}
              >
                {this._renderTitlePickerItems(this.state.recordedTitles)}
              </Picker>
            ),
          })}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  _renderTitlePickerItems = (array: string[]) => {
    const srvItems = [];
    if (array.length > 0) {
      srvItems.push(
        <Picker.Item key={-1} label={locale.register.pickerFirstItem} value={""} />
      );
      array.forEach((value, index) => {
        srvItems.push(
          <Picker.Item
            key={index}
            // @ts-ignore
            label={String(value.title)}
            // @ts-ignore
            value={String(value.title)}
          />
        );
      });
    } else {
      srvItems.push(
        <Picker.Item key={-1} label={locale.register.pickerNoItem} value={""} />
      );
    }
    return srvItems;
  };

  _page = () => (
    <View style={styles.container.page}>
      <View style={styles.container.switch}>
        <Text style={styles.styles.titleLabel}>{locale.register.page}</Text>
        <Switch
          onValueChange={() => this.setState({ canUseRange: !this.state.canUseRange })}
          value={this.state.canUseRange}
        />
      </View>
      {this._renderPagePicker()}
    </View>
  );

  _renderPagePicker = () => {
    if (!this.state.canUseRange) return;

    return (
      <View style={styles.container.pageSet}>
        <TouchableOpacity
          onPress={() => {
            if (this.state.canUseRange) {
              this.setState({ visibleModal: VISIBLE_MODAL.PAGE_START });
            }
          }}
        >
          <View style={styles.styles.pageButton}>
            <Text style={styles.styles.pageText}>
              p.{this.state.remind.range.start}
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, marginLeft: 30, marginRight: 30 }}>
          〜
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (this.state.canUseRange) {
              this.setState({ visibleModal: VISIBLE_MODAL.PAGE_END });
            }
          }}
        >
          <View style={styles.styles.pageButton}>
            <Text style={styles.styles.pageText}>p.{this.state.remind.range.end}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  _renderPageModal = () => (
    <TouchableOpacity
      style={{
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        zIndex: 0,
      }}
      disabled={
        !(this.state.visibleModal === VISIBLE_MODAL.PAGE_START || this.state.visibleModal === VISIBLE_MODAL.PAGE_END)
      }
      onPress={() => this.setState({ visibleModal: VISIBLE_MODAL.DEFAULT })}
      accessible={false}
    >
      <View style={styles.container.pageModal}>
        <TouchableOpacity
          style={[styles.container.pageModal, { zIndex: 1, flex: 1 }]}
        >
          <Picker
            onValueChange={(value) => {
              if (this.state.visibleModal === VISIBLE_MODAL.PAGE_START) {
                if (Number(value) > Number(this.state.remind.range.end)) {
                  this.setState({
                    remind: this.state.remind.setRange({
                      start: value,
                      end: value
                    })
                  })
                } else {
                  this.setState({
                    remind: this.state.remind.setRange({
                      start: value,
                      end: this.state.remind.range.end
                    })
                  })
                }
              }
              if (this.state.visibleModal === VISIBLE_MODAL.PAGE_END) {
                if (!(Number(value) < Number(this.state.remind.range.start))) {
                  this.setState({
                    remind: this.state.remind.setRange({
                      start: this.state.remind.range.start,
                      end: value
                    })
                  })
                }
              }
            }}
            selectedValue={
              this.state.visibleModal === VISIBLE_MODAL.PAGE_START
                ? this.state.remind.range.start
                : this.state.remind.range.end
            }
            style={{ width: "100%", flex: 0.6 }}
            hitSlop={{ top: 100, bottom: 100, left: 100, right: 100 }}
          >
            {this._renderPickerItems()}
          </Picker>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  _renderPickerItems = () => {
    const srvItems = [];
    for (let i = 1; i <= 500; i++) {
      srvItems.push(
        <Picker.Item key={String(i)} label={String(i)} value={String(i)} />
      );
    }
    return srvItems;
  };

  _memo = () => (
    <View style={styles.container.page}>
      <View style={styles.container.switch}>
        <Text style={styles.styles.titleLabel}>{locale.register.memo}</Text>
        <Switch
          onValueChange={() => this.setState({ canUseMemo: !this.state.canUseMemo })}
          value={this.state.canUseMemo}
        />
      </View>
      {this._renderMemoInputBox()}
    </View>
  );

  _renderMemoInputBox = () => {
    if (!this.state.canUseMemo) return;

    return (
      <View style={styles.container.boxContainer}>
        <TextInput
          style={styles.styles.inputBox}
          multiline={true}
          maxLength={400}
          onChangeText={(text) => this.setState({
            remind: this.state.remind.setMemo(text)
          })}
          value={this.state.remind.memo}
        />
      </View>
    );
  };

  _repeat = () => (
    <View style={styles.container.page}>
      <View style={styles.container.switch}>
        <Text style={styles.styles.titleLabel}>{locale.register.repeat}</Text>
        <Switch
          onValueChange={() => this.setState({ isRepeatable: !this.state.isRepeatable })}
          value={this.state.isRepeatable}
        />
      </View>
      {this._notice()}
      {this._renderRepeatList()}
    </View>
  );

  _renderRepeatList = () => {
    if (!this.state.isRepeatable || this.state.repeatSetting.ownSettings.length === 0) return;

    const { repeatSetting } = this.state;

    const defaultValue = repeatSetting.getCurrentSetting().name
    const selectItems = this.state.repeatSetting?.ownSettings.map((noticeInterval, i) => (
      <Select.Item label={noticeInterval.name} value={String(noticeInterval.id)} key={i} />
    ))

    return (
      <Select
        selectedValue={defaultValue}
        minWidth={200}
        accessibilityLabel={defaultValue}
        placeholder={defaultValue}
        onValueChange={(itemValue) => {
          const id = Number(itemValue)
          this.setState({
            repeatSetting: this.state.repeatSetting.setCurrentSetting(id)
          })
        }}
        _selectedItem={{
          bg: "cyan.600",
          endIcon: <CheckIcon size={4} />,
        }}
      >
        {selectItems}
      </Select>
    )
  };

  _notice = () => {
    if (!this.state.isRepeatable) return;
    return (
      <View style={styles.container.page}>
        <View style={styles.container.subContents}>
          <Text style={styles.styles.subTitleLabel}>・{locale.register.notice}</Text>
          <Switch
            onValueChange={() => this.setState({ isNotice: !this.state.isNotice })}
            style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
            value={this.state.isNotice}
          />
        </View>
      </View>
    );
  };

  _keyboardWillHide() {
    // console.log("Keyboard will show");
    this.setState({ keyboardHidden: false });
  }

  _keyboardDidHide() {
    // console.log("Keyboard Hidden");
    this.setState({ keyboardHidden: true });
  }

  render() {
    return (
      // 画面全体に判定を持ち、条件に応じて処理する。
      <TouchableOpacity
        style={styles.container.modalBackground}
        disabled={this.state.keyboardHidden}
        activeOpacity={0}
        onPress={() => Keyboard.dismiss}
        accessible={false}
      >
        <View style={styles.container.container}>
          <View style={styles.container.view}>
            <ScrollView style={{ flex: 1 }}>
              <View style={styles.params.title}>{this._title()}</View>

              <View style={styles.params.param}>{this._page()}</View>
              <View style={styles.params.param}>{this._memo()}</View>
              <View style={styles.params.param}>{this._repeat()}</View>

              <View style={styles.container.blank}/>
            </ScrollView>
          </View>
          <View style={styles.container.register}>
            {this._renderButton(
              locale.register.registerButton,
              this.onRegister,
              styles.styles.registerButton
            )}
          </View>
          <Modal isVisible={this.state.visibleModal === VISIBLE_MODAL.PAGE_START}>
            {this._renderPageModal()}
          </Modal>
          <Modal isVisible={this.state.visibleModal === VISIBLE_MODAL.PAGE_END}>
            {this._renderPageModal()}
          </Modal>
          <Modal isVisible={this.state.visibleModal === VISIBLE_MODAL.TITLE}>
            {this._renderTitleModal()}
          </Modal>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = {
  container: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',

    },
    view: {
      flex: 9,
      //alignItems: 'center',
    },
    register: {
      height: 70
    },
    title: {
      width: '100%',
      height: '100%',
      paddingTop: 10,
      paddingLeft: 10,
      paddingRight: 10,
      flex: 1,

    },
    page: {

    },
    switch: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 10,
      paddingRight: 10,
      borderColor: 'gray',
      borderBottomWidth: 1,
      borderTopWidth: 1,
      width: '100%'
    },
    subContents: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 3,
      paddingBottom: 3,
      paddingLeft: 10,
      paddingRight: 10,
      borderColor: 'gray',
      borderBottomWidth: 1,
      borderTopWidth: 1,
      width: '100%',
      backgroundColor: 'whitesmoke'
    },
    pageSet: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      borderColor: 'gray',
      borderBottomWidth: 1,
    },
    pageModal: {
      backgroundColor: 'white',
      flex: 0.4,
      justifyContent: 'space-between',
      alignContent: 'center',
      borderRadius: 10,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalBackground: {
      flex: 1,
    },
    boxContainer: {
      padding: 10,
      borderWidth: 0,
      borderColor: 'blue'
    },
    blank: {
      height: 300
    }
  }),

  params: StyleSheet.create({
    title: {
      height: 100,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'gray',
      borderBottomWidth: 1,

    },


    param: {
      width: '100%',
      borderColor: 'gray',
      borderWidth: 0
    },
    notice: {
      width: '100%',
      marginTop: 5,
      borderColor: 'gray',
    },

  }),


  styles: StyleSheet.create({
    registerButton: {
      backgroundColor: 'lightblue',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      width: '100%',
      height: '100%',
    },
    pageButton: {
      backgroundColor: 'powderblue',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: 10,
      width: 80,
      height: 40,
    },
    titleLabel: {
      fontSize: 20,
    },
    subTitleLabel: {
      fontSize: 16,
      paddingLeft: 14
    },
    titleInputBox: {
      height: 30,
      width: '100%',
      fontSize: 20,
      paddingLeft: 5,
      borderRadius: 5,
      borderColor: 'powderblue',
      borderWidth: 2,
      backgroundColor: 'white',
      position: 'absolute',
    },
    modalButton: {
      backgroundColor: 'lightblue',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: 10,
      width: '100%',
      height: 50,
    },
    registerText: {
      fontWeight: 'bold',
      fontSize: 30,
    },
    pageText: {
      fontSize: 20
    },
    cameraIcon: {
      width: 20,
      height: 20,
      overflow: 'visible',
      position: 'absolute',
      top: 5,
      right: 5
    },
    inputBox: {
      height: 80,
      borderWidth: 2,
      borderRadius: 5,
      paddingLeft: 5,
      borderColor: 'powderblue',
      backgroundColor: 'whitesmoke'
    },
    titleListIcom: {
      width: 25,
      height: 25,
    }
  })
}