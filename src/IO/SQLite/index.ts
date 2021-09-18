import * as SQLite from "expo-sqlite";

const databaseName = "db.db";
const db = SQLite.openDatabase(databaseName);

/**
 * Write用糖衣構文
 * @param query
 * @param callback
 */
const exWithTx = <T>(query: string, callback: (resolve: (value: (T)) => void, resultSet: SQLite.SQLResultSet) => void): Promise<T> => {
  return new Promise((r) => {
    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, result) => {
        callback(r, result);
      })
    })
  })
}

/**
 * Read用糖衣構文
 * @param query
 */
const exWithReadTx = <T>(query: string): Promise<T> => {
  return new Promise((r) => {
    db.readTransaction((tx) => {
      tx.executeSql(query, [], (tx, result) => {
        // @ts-ignore
        const { _array } = result.rows;
        r(_array);
      })
    })
  })
}

export const getTitlesAsync = () => {
  return exWithReadTx<string[]>("SELECT title FROM titleList");
}

export interface INoticeInterval {
  id: number;
  name: string;
  interval: number[];
}

export const getNoticeIntervals = async (): Promise<INoticeInterval[]> => {
  const noticeIntervals = await exWithReadTx<any[]>("SELECT id, name, interval FROM noticeInterval");
  return noticeIntervals.map((n) => ({
    ...n,
    interval: JSON.parse(n.interval)
  }))
}