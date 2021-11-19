import * as SQLite from "expo-sqlite";

const databaseName = "db.db";
const db = SQLite.openDatabase(databaseName);

/**
 * Write用糖衣構文
 * @param query
 * @param args
 */
const exWithTx = <T>(query: string, args: string[]): Promise<T> => {
  return new Promise((r) => {
    db.transaction((tx) => {
      tx.executeSql(query, args, (tx, result) => {
        // @ts-ignore
        const { _array } = result.rows;
        r(_array);
      })
    })
  })
}

/**
 * Read用糖衣構文
 * @param query
 * @param args
 */
const exWithReadTx = <T>(query: string, args: string[]): Promise<T> => {
  return new Promise((r) => {
    db.readTransaction((tx) => {
      tx.executeSql(query, args, (tx, result) => {
        // @ts-ignore
        const { _array } = result.rows;
        r(_array);
      })
    })
  })
}

export interface ITitle {
  title: string
}

export const getTitlesAsync = () => {
  return exWithReadTx<ITitle[]>("SELECT title FROM titleList", []);
}

export interface INoticeInterval {
  id: number;
  name: string;
  interval: number[];
}

export const getNoticeIntervals = async (): Promise<INoticeInterval[]> => {
  const noticeIntervals = await exWithReadTx<any[]>("SELECT id, name, interval FROM noticeInterval", []);
  return noticeIntervals.map((n) => ({
    ...n,
    interval: JSON.parse(n.interval)
  }))
}

interface IRange {
  range: {
    start: number,
    end: number
  }
}

export const getRangeAsync = async (masterId: number): Promise<IRange | null> => {
  const raw = await exWithReadTx<{value: string}[]>("SELECT value FROM page WHERE id = ?", [String(masterId)]);
  if (raw.length === 0) return null;

  const [{value}] = raw;
  const page = JSON.parse(value);
  return {
    range: {
      start: page.startPage,
      end: page.endPage
    }
  }
}

export const updateRangeAsync = async (masterId: number, range: string) => {
  await exWithTx("UPDATE page SET value = ? WHERE id = ?", [range, String(masterId)])
}

type IMemo = string;

export const getMemoAsync = async (masterId: number): Promise<IMemo | null> => {
  const raw = await exWithReadTx<{value: string}[]>("SELECT value FROM memo WHERE id = ?", [String(masterId)]);
  if (raw.length === 0) return null;

  const [{value}] = raw;
  console.log(value);
  return value;
}

export const updateMemoAsync = async (masterId: number, memo: string) => {
  await exWithTx("UPDATE memo SET value = ? WHERE id = ?", [memo, String(masterId)])
}
