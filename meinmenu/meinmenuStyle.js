import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',    
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    height: 100,
    width: 200,
    margin: 50, 
  },
  text: {
    fontWeight: 'bold',
    fontSize: 30,
  },
});

module.exports = {
  'meinmenu' : styles,
}