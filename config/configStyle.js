import { StyleSheet, Platform } from 'react-native';


const container = StyleSheet.create({
  container: {
    flex: 1,
  },
  cellContainer: {
    borderColor: 'gray',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    padding: 3
  },
  todayCellContainer: {
    borderColor: 'gray',
    borderBottomWidth: 1,
    padding: 6,
    backgroundColor: 'powderblue', 
  }
})

const params = StyleSheet.create({
  cellTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  cellText: {
    fontSize: 15,
  },
  cellPageText: {
    fontSize: 15,
    color: 'blue',
  },
})

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

module.exports = {
  'container' : container,
  'params' : params,
  'localStyles' : localStyles,
  'devStyles' : devStyles
}