import {Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import * as MailComposer from 'expo-mail-composer';
import {Icons} from "../../Config/Assets";

// 必須フィールド
// *job --- *name
//      |- contacts []
//            |-- iconPath
//            --- hyperLink
const developer = {
  Programer: [
    {
      name: "Tsubasa Nagata",
      // 画像アイコン(50*50)のパスを指定する
      contacts: [
        {
          icon: Icons.developer.email,
          type: "email",
          // mail object
          link: {
            recipients: ["sinnyo.tsubasa@gmail.com"],
            subject: "app name:おぼえる君",
            body: "",
          },
        },
        {
          icon: Icons.developer.facebook,
          type: "link",
          link: "https://www.facebook.com/profile.php?id=100004769313128",
        },
        {
          icon: Icons.developer.twitter,
          type: "link",
          link: "https://twitter.com/TsubasaNagata",
        },
      ],
    },
  ],
  Designer: [
    {
      name: "Hibiki Shono",
      // 画像アイコン(50*50)のパスを指定する
      contacts: [
        {
          icon: Icons.developer.email,
          type: "email",
          // mail object
          link: {
            recipients: ["sharks.soccer02@gmail.com"],
            subject: "app name:おぼえる君",
            body: "",
          },
        },
        {
          icon: Icons.developer.facebook,
          type: "link",
          link: "https://www.facebook.com/shonohibiki",
        },
      ],
    },
  ],
};

type DevType = typeof developer;

function _renderDevContents (obj: DevType) {
  let contentList: React.ReactElement[] = [];
  if (obj !== null) {
    Object.keys(obj).forEach((key) => {
      // exp. programer
      // @ts-ignore
      obj[key].forEach((v, i) => {
        const person = obj[key][i];
        //console.log('person :', person)
        const renderContents = (contents) => {
          let contactList: React.ReactElement[] = [];
          contents.forEach(function (v, i) {
            let func;
            const type = contents[i].type;
            if (type == "link") {
              func = (url) =>
                Linking.openURL(url).catch((err) =>
                  console.error("An error occurred", err)
                );
            } else if (type == "email") {
              func = (saveOptions) => MailComposer.composeAsync(saveOptions);
            }
            contactList.push(
              <TouchableOpacity
                key={i}
                onPress={() => func(contents[i].link)}
                activeOpacity={0.1}
              >
                <View style={devStyles.contactItem}>
                  <Image
                    source={contents[i].icon}
                    style={devStyles.imageIcon}
                  />
                </View>
              </TouchableOpacity>
            );
          });
          return contactList;
        };
        contentList.push(
          <View key={key} style={localStyles.miniContainer}>
            <Text style={devStyles.job}>{key}</Text>
            <View style={devStyles.contents}>
              <Text style={devStyles.name}>{person.name}</Text>
              <View
                style={[
                  devStyles.contacts,
                  devStyles.centering,
                  devStyles.arroundBorder,
                  { width: 10 + person.contacts.length * 70 },
                ]}
              >
                <Text style={devStyles.contactsLabel}>Contacts</Text>
                {renderContents(person.contacts)}
              </View>
            </View>
          </View>
        );
      });
    });
  }
  return contentList;
}

function Credit () {
  return (
    <View style={localStyles.background}>
      {_renderDevContents(developer)}
    </View>
  )
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
  },
  miniContainer: {
    marginTop: 5,
    marginLeft: 10,
    paddingLeft: 15,
    paddingTop: 7,
    paddingRight: 20,
    paddingBottom: 7,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  }
})

const devStyles = StyleSheet.create({
  job: {
    fontSize: 24,
    marginBottom: 5
  },
  contents: {
    paddingLeft: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    marginBottom: 3,
  },
  contacts: {
    padding: 5,
    marginTop: 7,
    flexDirection: 'row',
    zIndex: 0,
  },
  centering: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  arroundBorder: {
    borderWidth: 1,
    borderRadius: 5,
  },
  contactsLabel: {
    position: 'absolute',

    backgroundColor: 'white',
    paddingLeft: 3,
    paddingRight: 3,
    zIndex: 1,
    ...Platform.select({
      ios: {
        top: -10,
        left: 7,
      },
      android: {
        top: -5,
        left: 7,
      },
    }),
  },
  contactItem: {
    alignContent: 'center',
    alignItems: 'center',
    margin: 10,
    width: 50,
    height: 50
  },
  imageIcon: {
    width: 50,
    height: 50
  }
})

export default Credit;