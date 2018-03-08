import { StyleSheet } from 'react-native';


const container = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    
  },
  view: {
    flex: 9,
    //alignItems: 'center',
  },
  register: {
    flex: 1,
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
    padding: 10,
    borderColor: 'gray',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    width: '100%'
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
})

const params = StyleSheet.create({
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
    borderColor: 'powderblue',
    backgroundColor: 'whitesmoke'
  },
  titleListIcom: {
    width: 25,
    height: 25,
    position: 'absolute',
    top: 3,
    right: 5,
    overflow: 'visible'
  }
})

module.exports = {
  'container' : container,
  'params' : params,
  'styles' : styles,
}