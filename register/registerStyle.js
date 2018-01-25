import { StyleSheet } from 'react-native';


const container = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    flex: 9,
    alignItems: 'center',
  },
  register: {
    flex: 1,
  },
  title: {
    width: '100%',
    height: '100%',
    padding: 10,
    flex: 1,
    flexDirection: 'row'
  },
  page: {
    marginBottom: 10,
  },
  pageSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderColor: 'gray',
    borderBottomWidth: 1,
    width: '100%'
  },
  pageSet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderColor: 'gray',
    borderBottomWidth: 1,
  },
  pageModal: {
    backgroundColor: 'white', 
    flex: 0.6 , 
    justifyContent: 'space-between',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
})

const params = StyleSheet.create({
  title: {
    height: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'gray',
    borderBottomWidth: 2,

  },
  

  param: {
    width: '100%',
    borderColor: 'gray',
  },
  notice: {
    width: '100%',
    marginTop: 5,
    borderColor: 'gray',
  },
  
})

const styles = StyleSheet.create({
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
  titleInputBox: {
    height: 30,
    width: '100%',
    fontSize: 20,
    backgroundColor: 'white',
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
    width: 50,
    height: 50,
    backgroundColor: 'lightgrey'
  },

})

module.exports = {
  'container' : container,
  'params' : params,
  'styles' : styles,
}