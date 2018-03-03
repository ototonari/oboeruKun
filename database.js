import { SQLite } from 'expo';
import { Actions, ActionConst } from "react-native-router-flux";
import { dateToFormatString } from './dateToFormatString';


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

// 各種データベースが追加された際はinitDBに追記すること！
export function initDB() {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS master (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL);',[],
      () => console.log('initDB, create master success') ,
      (error) => console.log('initDB, create master error: ', error)
    )
    //tx.executeSql('DELETE FROM master WHERE id = 2')
    tx.executeSql('SELECT * FROM master', [], (_, { rows }) => console.log('select master : ', rows));
    //tx.executeSql( 'drop table master' );
  })
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS memo (id INTEGER NOT NULL, value TEXT);',[],
      () => console.log('initDB, create memo success') ,
      (error) => console.log('initDB, create memo error: ', error)
    )
    tx.executeSql('SELECT * FROM memo', [], (_, { rows }) => console.log('select memo : ', rows));
    //tx.executeSql( 'drop table memo' );

  })
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS page (id INTEGER NOT NULL, value TEXT);',[],
      () => console.log('initDB, create page success') ,
      (error) => console.log('initDB, create page error: ', error)
    )
    tx.executeSql('SELECT * FROM page', [], (_, { rows }) => console.log('select page : ', rows));
    //tx.executeSql( 'drop table page' );
  })
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS notice (id INTEGER NOT NULL, notificationId TEXT, noticeDate BLOB, done INTEGER DEFAULT 1);',[],
      () => console.log('initDB, create notice success') ,
      (error) => console.log('initDB, create notice error: ', error)
    )
    tx.executeSql('SELECT * FROM notice', [], (_, { rows }) => console.log('select notice : ', rows));
    //tx.executeSql( 'drop table notice' );

  })
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS titleList (id INTEGER NOT NULL PRIMARY KEY, title TEXT);',[],
      () => console.log('initDB, create titleList success') ,
      (error) => console.log('initDB, create titleList error: ', error)
    )
  })
  
}

export function insertMaster(title, callback) {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO master (title) values (?)', [title],
      (_, { insertId }) => {
        console.log('insertMaster success : ', insertId)
        callback(insertId)
      }
      ,
      (error) => console.log('insertMaster error: ', error)
    )
  })
}

export function insertMemo(id, memo) {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO memo (id, value) values (?, ?)', [id, memo],
      () => console.log('insertMemo success'),
      (error) => console.log('insertMemo error: ', error)
    )
  })
}

export function insertPage(id, page) {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO page (id, value) values (?, ?)', [id, page],
      () => console.log('insertPage success'),
      (error) => console.log('insertPage error: ', error)
    )
  })
}

export function insertNotice(id, notificationId, noticeDate) {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO notice (id, notificationId, noticeDate) values (?, ?, ?)', [id, notificationId, noticeDate],
      () => console.log('insertNotice success'),
      (error) => console.log('insertNotice error: ', error)
    )
  })
}

// notice table から where 句でどこまで絞り込めるかの検証を行った。
// 結論としては、年月日に加え、時間情報を持った文字列を含む情報から任意の日時を検索することができた。これは大きい。
// 本日を基準にして、初回ロードは前後1月分をロードさせるように調節する。数字一つのパラメーターでロードする月をシフトするように設計する。
export async function getNotice(callback) {
  const getThisMonth = () => {
    let thisMonth = new Date()
    const firstDay = dateToFormatString( new Date(thisMonth.setDate(1)), '%YYYY%-%MM%-%DD%')
    const endDay = dateToFormatString( new Date(thisMonth.setDate(33)), '%YYYY%-%MM%-%DD%')
    console.log('first Day ; ', firstDay, 'end Day ; ', endDay)
    return [firstDay, endDay]
  }
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM notice WHERE noticeDate >= ? AND noticeDate < ? AND done = 1', getThisMonth(),
      (_, { rows: { _array } }) => {
        console.log('getNotice success : ', _array)
        if (callback) {
          callback(_array)
        }
      }
    )
  })
}

export async function getMaster(id, callback) {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT title FROM master WHERE id = ?', [id],
      (_, { rows: { _array } }) => callback(_array)
    )
  })
}

export async function getParams(column, tableName, id) {
  return new Promise(resolve => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT ${column} FROM ${tableName} WHERE id = ?`, [id],
        (_, { rows: { _array } }) => resolve(_array)
      )
    })
  })
}

export async function setNotice(value, noticeDate, id) {
  return new Promise(resolve => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE notice SET done = ? WHERE id = ? AND noticeDate = ?', [value, id, noticeDate],

      )
    })
  })
}

export async function testGetTitle() {
  return new Promise(resolve => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM master WHERE id = 1', [],
        (_, { rows: { _array } }) => resolve(_array)
      )
    })
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
          //target.setState({ items: array})
          //console.log(array)
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