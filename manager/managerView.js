import React, { Component } from 'react';
import { FlatList, View, Platform } from 'react-native';
import { getAllNoticeDate } from "../database";
import styles from "./managerStyle";
import TaskCellView from "./cellView";


export default class ManagerView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      reload: this.props.reload ? this.props.reload : false,
    }
  }

  componentDidMount() {
    getAllNoticeDate(this)
  }

  render () {
    return (
      <View style={styles.container.container} >
        <FlatList
          data={this.state.items}
          keyExtractor={item => item.id}
          renderItem={({item}) => <TaskCellView item={item} father={this} /> }
          bounces={false}
        />
      </View>
    )
  }
}