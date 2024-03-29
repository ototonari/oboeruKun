import * as SQLite from "expo-sqlite";
import { dateToFormatString } from "./dateToFormatString";
import {locale} from "./src/Config/Locale"

const db = SQLite.openDatabase("db.db");

export function createDB() {
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists taskData (id integer primary key not null, title text, registerd, page int, notice text);"
    );
    tx.executeSql(
      "create table if not exists pageData (id integer primary key not null, startPage int, endPage int);"
    );
    tx.executeSql(
      "create table if not exists notification (id integer primary key not null, title text, page text, noticeDate blob, notificationId text);"
    );
    tx.executeSql(
      "create table if not exists titleList (id integer primary key not null, title text);"
    );
  });
}

// 各種データベースが追加された際はinitDBに追記すること！
export function initDB() {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS master (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL);",
      [],
      () => console.log("initDB, create master success"),
      (error) => console.log("initDB, create master error: ", error)
    );
    //tx.executeSql('DELETE FROM master WHERE id = 2')
    //tx.executeSql('SELECT * FROM master', [], (_, { rows }) => console.log('select master : ', rows));
    //tx.executeSql( 'drop table master' );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS memo (id INTEGER NOT NULL, value TEXT);",
      [],
      () => console.log("initDB, create memo success"),
      (error) => console.log("initDB, create memo error: ", error)
    );
    //tx.executeSql('SELECT * FROM memo', [], (_, { rows }) => console.log('select memo : ', rows));
    //tx.executeSql( 'drop table memo' );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS page (id INTEGER NOT NULL, value TEXT);",
      [],
      () => console.log("initDB, create page success"),
      (error) => console.log("initDB, create page error: ", error)
    );
    //tx.executeSql('SELECT * FROM page', [], (_, { rows }) => console.log('select page : ', rows));
    //tx.executeSql( 'drop table page' );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS notice (id INTEGER NOT NULL, notificationId TEXT, noticeDate BLOB, done INTEGER DEFAULT 1);",
      [],
      () => console.log("initDB, create notice success"),
      (error) => console.log("initDB, create notice error: ", error)
    );
    //tx.executeSql('SELECT * FROM notice', [], (_, { rows }) => console.log('select notice : ', rows));
    //tx.executeSql( 'drop table notice' );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS titleList (id INTEGER NOT NULL PRIMARY KEY, title TEXT);",
      [],
      () => console.log("initDB, create titleList success"),
      (error) => console.log("initDB, create titleList error: ", error)
    );
    //tx.executeSql( 'drop table titleList' );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS noticeInterval (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, interval TEXT NOT NULL, name TEXT NOT NULL)",
      [],
      () => console.log("initDB, create noticeInterval success"),
      (error) => console.log("initDB, create noticeInterval error: ", error)
    );
    tx.executeSql(
      "SELECT * FROM noticeInterval",
      [],
      (_, { rows: { _array } }) => {
        //console.log('noticeInterval : ', _array)
        if (_array.length > 0) return;
        // 初期サンプルの挿入
        const sampleInterval = JSON.stringify([1, 7, 30]);

        const name = locale.sample.title
        tx.executeSql(
          "INSERT INTO noticeInterval (interval, name) values (?, ?)",
          [sampleInterval, name],
          () => console.log("initDB, insert into noticeInterval success"),
          (error) =>
            console.log("initDB, insert into noticeInterval error: ", error)
        );
      }
    );
    //tx.executeSql( 'drop table noticeInterval')
  });
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS updateTable (id INTEGER NOT NULL PRIMARY KEY DEFAULT 0, buildNumber TEXT DEFAULT '1.0.0' NOT NULL);",
      [],
      () => {
        console.log("initDB, create updateTable success");
      },
      (error) => console.log("initDB, create updateTable error: ", error)
    );
    //tx.executeSql( 'drop table updateTable' )
  });
}

export async function insertMaster(title) {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO master (title) values (?)",
        [title],
        (_, { insertId }) => {
          console.log("insertMaster success : ", insertId);
          resolve(insertId);
        },
        (error) => console.log("insertMaster error: ", error)
      );
    });
  });
}

export async function insertMemo(id, memo) {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO memo (id, value) values (?, ?)",
        [id, memo],
        () => {
          console.log("insertMemo success");
          resolve();
        },
        (error) => console.log("insertMemo error: ", error)
      );
    });
  });
}

export async function insertPage(id, page) {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO page (id, value) values (?, ?)",
        [id, page],
        () => {
          console.log("insertPage success");
          resolve();
        },
        (error) => console.log("insertPage error: ", error)
      );
    });
  });
}

export async function insertNotice(masterId, notificationId, noticeDate) {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO notice (id, notificationId, noticeDate) values (?, ?, ?)",
        [masterId, notificationId, noticeDate],
        () => {
          console.log("insertNotice success");
          resolve();
        },
        (error) => console.log("insertNotice error: ", error)
      );
    });
  });
}

export function insertNoticeInterval(list, name) {
  return new Promise((resolve) => {
    const intervalList = JSON.stringify(list);
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO noticeInterval (interval, name) values (?, ?)",
        [intervalList, name],
        () => {
          console.log("insertNoticeInterval success");
          resolve();
        },
        (error) => console.log("insertNoticeInterval error: ", error)
      );
    });
  });
}

// notice table から where 句でどこまで絞り込めるかの検証を行った。
// 結論としては、年月日に加え、時間情報を持った文字列を含む情報から任意の日時を検索することができた。これは大きい。
// 本日を基準にして、初回ロードは前後1月分をロードさせるように調節する。数字一つのパラメーターでロードする月をシフトするように設計する。
export async function getNotice(rangeList) {
  return new Promise((resolve) => {
    // rangeList がからの場合、こちらで範囲を生成する
    const getThisMonth = () => {
      if (rangeList !== null) {
        return rangeList;
      }
      let thisMonth = new Date();
      const endDay = dateToFormatString(
        new Date(thisMonth.setMonth(thisMonth.getMonth() + 1)),
        "%YYYY%-%MM%-%DD%"
      );
      const firstDay = dateToFormatString(
        new Date(thisMonth.setMonth(thisMonth.getMonth() - 1, 1)),
        "%YYYY%-%MM%-%DD%"
      );
      console.log("first Day ; ", firstDay, "end Day ; ", endDay);
      return [firstDay, endDay];
    };
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM notice WHERE noticeDate >= ? AND noticeDate < ? AND done = 1",
        getThisMonth(),
        (_, { rows: { _array } }) => {
          // console.log("getNotice success : ", _array);
          resolve(_array);
        }
      );
    });
  });
}

export async function getMaster(id, callback) {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT title FROM master WHERE id = ?",
      [id],
      (_, { rows: { _array } }) => callback(_array)
    );
  });
}

export async function getParams(column, tableName, id) {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT ${column} FROM ${tableName} WHERE id = ?`,
        [id],
        (_, { rows: { _array } }) => resolve(_array)
      );
    });
  });
}

export function getAllParams(column, tableName) {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT ${column} FROM ${tableName}`,
        [],
        (_, { rows: { _array } }) => resolve(_array)
      );
    });
  });
}

export function deleteParams(tableName, id) {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(`DELETE FROM ${tableName} WHERE id = ?`, [id], () =>
        resolve()
      );
    });
  });
}

export async function setNotice(value, noticeDate, id) {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE notice SET done = ? WHERE id = ? AND noticeDate = ?",
        [value, id, noticeDate],
        () => resolve()
      );
    });
  });
}

export async function getSpecificNotice(noticeDate, id) {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT notificationId FROM notice WHERE id = ? AND noticeDate = ?",
        [id, noticeDate],
        (_, { rows: { _array } }) => resolve(_array)
      );
    });
  });
}

export async function changeNotice(
  nextNoticeDate,
  notificationId,
  noticeDate,
  id
) {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE notice SET noticeDate = ? notificationId = ? WHERE id = ? AND noticeDate = ?",
        [nextNoticeDate, notificationId, id, noticeDate],
        () => {
          resolve();
        }
      );
    });
  });
}

export async function testGetTitle() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM master WHERE id = 1",
        [],
        (_, { rows: { _array } }) => resolve(_array)
      );
    });
  });
}

export function deleteList(id) {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM titleList where id = ?", [id], () =>
        resolve()
      );
    });
  });
}

export function createUpdateTable(callback) {
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists updateTable (id integer primary key default 0 not null, buildNumber text default '1.0.0' not null );",
      [],
      () => {
        console.log("createUpdateTable: success");
        getBuildNumber(callback);
      },
      () => console.log("createUpdateTable: raise error")
    );
  });
}

export function updateBuildNumber(currentBuildNumber) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "update updateTable set buildNumber = ? where id = 0",
        [String(currentBuildNumber)],
        () => {
          console.log("updateBuildNumber: success");
          resolve();
        },
        () => {
          console.log("updateBuildNumber: raise error");
          reject();
        }
      );
    });
  });
}

export function getBuildNumber() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT buildNumber FROM updateTable",
        [],
        (_, { rows: { _array } }) => resolve(_array)
      );
    });
  });
}

export function initializeUpdateTable() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO updateTable (id, buildNumber) values (0, '1.0.0')",
        [],
        () => resolve(),
        () => console.log("updateTable initialized raise error")
      );
    });
  });
}

export function dropDB(tableName) {
  db.transaction((tx) => {
    tx.executeSql("drop table notification");
  });
}

export function selectAll() {
  db.transaction((tx) => {
    tx.executeSql("select title from notification", [], (_, { rows }) =>
      console.log(JSON.stringify(rows))
    );
  });
}

export function insertInto(text) {
  db.transaction((tx) => {
    tx.executeSql("insert into items (done, value) values (0, ?)", [text]);
  });
}

export function addTaskData(taskData) {
  const title = taskData.title;
  const page = taskData.page !== null ? 1 : 0;
  const registerd = taskData.registerd;
  db.transaction((tx) => {
    tx.executeSql(
      "insert into taskData (title, registerd, page, notice) values (?, ?, ?, ?)",
      [title, registerd, page, "forgetting"],
      (_, { insertId }) => {
        if (page === 1) {
          tx.executeSql(
            "insert into pageData (id, startPage, endPage) values (?, ?, ?)",
            [insertId, taskData.page.startPage, taskData.page.endPage]
          );
        }
      }
    );
  });
}

export function checkTitle(title) {
  db.transaction((tx) => {
    tx.executeSql(
      "select id from titleList where title = ?",
      [title],
      (_, { rows }) => {
        const length = rows.length;
        if (length === 0) {
          addTitle(title);
        }
      },
      () => console.log("checkTitle: error")
    );
  });
}

function sortTitle(count, title) {
  let i = count;
  if (i > 0) {
    console.log("true");
    db.transaction((tx) => {
      tx.executeSql(
        "update titleList set id=? where id=?",
        [i + 1, i],
        () => {
          console.log("updating: ", i);
          i = i - 1;
          sortTitle(i, title);
        },
        (error) => console.log(error)
      );
    });
  } else {
    console.log("false");
    db.transaction((tx) => {
      tx.executeSql("insert into titleList values (?, ?)", [1, title], () =>
        console.log("addTitle succesed")
      );
    });
  }
}

export function addTitle(title) {
  db.transaction((tx) => {
    tx.executeSql(
      "insert into titleList (title) values (?)",
      [title],
      console.log("addTitle succesed")
    );
  });
}

export function deleteNotice(id, notificationId, callback) {
  db.transaction((tx) => {
    tx.executeSql("delete from notification where id = ?", [id], () => {
      //Sccess
      callback(notificationId);
    });
  });
}

export function getAllNoticeDate(target) {
  const self = target;
  db.transaction((tx) => {
    tx.executeSql(
      "select * from notification",
      [],
      (_, { rows: { _array } }) => {
        function setstate(target, array) {
          //target.setState({ items: array})
          //console.log(array)
        }
        sortedNoticeDate(self, _array, setstate);
      }
    );
  });
}

export function getAllItems(target) {
  const self = target;
  db.transaction((tx) => {
    tx.executeSql("select * from taskData", [], (_, { rows: { _array } }) =>
      self.setState({ items: _array })
    );
  });
}

export function getTitle(target) {
  const self = target;
  db.transaction((tx) => {
    tx.executeSql(
      "select title from titleList",
      [],
      (_, { rows: { _array } }) => {
        self.setState({ titleList: _array });
      }
    );
  });
}

export async function getAllTitle() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM titleList",
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        }
      );
    });
  });
}

export function deleteRow(target, id) {
  const self = target;
  db.transaction(
    (tx) => {
      tx.executeSql(`delete from taskData where id = ?;`, [id]);
      tx.executeSql("delete from pageData where id = ?;", [id]);
    },
    null,
    getAllItems(self)
  );
}

function sortedNoticeDate(target, array, callback) {
  array.sort(function (a, b) {
    return a.noticeDate > b.noticeDate ? 1 : -1;
  });
  callback(target, array);
}

export function showNotificationTable() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from notification",
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        resolve()
      );
    });
  });
}

export function dropNotificationTable() {
  return new Promise((resolve) => {
    tx.executeSql("drop table notification", [], resolve(), resolve());
  });
}
