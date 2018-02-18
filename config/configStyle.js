import { StyleSheet } from 'react-native';

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

const styles = StyleSheet.create({
  
})

module.exports = {
  'container' : container,
  'params' : params,
  'styles' : styles,
}