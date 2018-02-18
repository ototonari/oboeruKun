import { SQLite } from 'expo';
import { Actions, ActionConst } from "react-native-router-flux";


const db = SQLite.openDatabase('db.db');

export function createDB() {
  db.transaction(tx => {
    tx.executeSql(
      'create table if not exists taskData (id integer primary key not null, title text, registerd, page int, notice text);'
    )
    tx.executeSql(
      'create table if not exists pageData (id integer primary key not null, startPage int, endPage int);'
    )
    tx.executeSql(
      'create table if not exists notification (id integer primary key not null, title text, page text, noticeDate blob, notificationId text);'
    )
    tx.executeSql(
      'create table if not exists titleList (id integer primary key not null, title text);'
    )
  });
}

export function createUpdateTable(callback) {
  db.transaction(tx => {
    tx.executeSql(
      "create table if not exists updateTable (id integer primary key default 0 not null, buildNumber text default '1.0.0' not null );", [],
      () => {
        console.log('createUpdateTable: success')
        getBuildNumber(callback)
      },
      () => console.log('createUpdateTable: raise error')
    )
  })
}

export function updateBuildNumber(currentBuildNumber) {
  db.transaction(tx => {
    tx.executeSql(
      'update updateTable set buildNumber = ? where id = 0', [String(currentBuildNumber)],
      () => {
        console.log('updateBuildNumber: success')
      },
      () => console.log('updateBuildNumber: raise error')
    )
  })
}

export function getBuildNumber(callback) {
  db.transaction(tx => {
    tx.executeSql(
      'select buildNumber from updateTable', [],
      (_, { rows: { _array } }) => callback(_array)
    )
  })
}

export function initializeUpdateTable(callback) {
  db.transaction(tx => {
    tx.executeSql(
      "insert into updateTable (id, buildNumber) values (0, '1.0.0')", [],
      () => {
        console.log('updateTable initialized success')
        callback()
      },
      () => console.log('updateTable initialized raise error')
    )
  })
}

export function dropDB(tableName) {
  db.transaction(tx => {
    tx.executeSql(
      'drop table notification'
    )
  })
}

export function selectAll() {
  db.transaction(tx => {
    tx.executeSql(
      'select title from notification',[],
      (_, { rows }) => console.log(JSON.stringify(rows))
    )

  })
}

export function insertInto(text) {
  db.transaction(tx => {
    tx.executeSql(
      'insert into items (done, value) values (0, ?)', [text]
    )
  })
}

export function addTaskData(taskData) {
  const title = taskData.title
  const page = taskData.page !== null ? 1 : 0
  const registerd = taskData.registerd
  db.transaction(tx => {
    tx.executeSql(
      'insert into taskData (title, registerd, page, notice) values (?, ?, ?, ?)', [title,registerd,page,'forgetting'],
      (_, { insertId }) => {
        if (page === 1) {
          tx.executeSql(
            'insert into pageData (id, startPage, endPage) values (?, ?, ?)', [insertId, taskData.page.startPage, taskData.page.endPage]
          )
        }
      }
    )
  })
}

export function addNotice(taskData, noticeDate, notificationId) {
  const title = taskData.title
  const page = taskData.page
  db.transaction(tx => {
    tx.executeSql(
      'insert into notification (title, page, noticeDate, notificationId) values (?, ?, ?, ?)', [title, page, noticeDate, notificationId],
      // 追加処理成功時
      () => { Actions.tabbar({ type: ActionConst.PUSH_OR_POP }) }
    )
  })
}

export function checkTitle(title) {
  db.transaction(tx => {
    tx.executeSql(
      'select id from titleList where title = ?', [title],
      (_, { rows }) => {
        const length = rows.length
        if (length == 0) {
          addTitle(title)
        } else if (length == 1) {
          const selectedId = rows._array[0].id
          console.log(selectedId)
          //sortTitle(selectedId-1, title)
        }
      },
      () => console.log('checkTitle: error')
    )
  })
}

function countLength() {

}

function sortTitle(count, title) {
  let i = count
  if (i > 0) {
    console.log('true')
    db.transaction(tx => {
      tx.executeSql(
        'update titleList set id=? where id=?', [i+1, i],
        () => {
          console.log('updating: ', i)
          i = i - 1
          sortTitle(i, title)
        },
        (error) => console.log(error)
      )
    })
  } else {
    console.log('false')
    db.transaction(tx => {
      tx.executeSql(
        'insert into titleList values (?, ?)', [1, title],
        () => console.log('addTitle succesed')
      )
    })
  }
}

export function addTitle(title) {
  db.transaction(tx => {
    tx.executeSql(
      'insert into titleList (title) values (?)', [title],
      console.log('addTitle succesed')
    )
  })
}

export function deleteNotice(id, notificationId, callback) {
  db.transaction(tx => {
    tx.executeSql(
      'delete from notification where id = ?', [id],
      () => { //Sccess
        callback(notificationId)
      }
    )
  })
}

export function getAllNoticeDate(target) {
  const self = target
  db.transaction(tx => {
    tx.executeSql(
      'select * from notification', [],
      (_, { rows: { _array } }) => {
        function setstate (target, array) {
          target.setState({ items: array})
        }
        sortedNoticeDate(self, _array, setstate)
      }
    )
  })
}

export function getAllItems(target) {
  const self = target
  db.transaction(tx => {
    tx.executeSql(
      'select * from taskData',[],
      (_, { rows: { _array } }) => self.setState({ items: _array })
    )
  })
}

export function getTitle(target) {
  const self = target
  db.transaction(tx => {
    tx.executeSql(
      'select title from titleList',[],
      (_, { rows: { _array } }) => {
        self.setState({ titleList: _array })
      }
    )
  })
}

export function deleteRow(target, id) {
  const self = target
  db.transaction(tx => {
    tx.executeSql(`delete from taskData where id = ?;`, [id])
    tx.executeSql('delete from pageData where id = ?;', [id])
  }, null, getAllItems(self))

}

function sortedNoticeDate(target, array, callback) {
  array.sort(function(a, b) {
    return (a.noticeDate > b.noticeDate ? 1 : -1)
  })
  callback(target, array)
}