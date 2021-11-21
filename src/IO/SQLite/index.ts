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
      });
    });
  });
};

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
      });
    });
  });
};

export interface ITitle {
  title: string;
}

export const getTitlesAsync = async (): Promise<string[]> => {
  const raw = await exWithReadTx<ITitle[]>("SELECT title FROM titleList", []);
  return raw.map((r) => r.title);
};

export const getTitleAsync = async (masterId: number): Promise<string> => {
  const raw = await exWithReadTx<{ title: string }[]>(
    "SELECT title FROM master WHERE id = ?",
    [String(masterId)]
  );
  const [{ title }] = raw;
  return title;
};

export const updateTitleAsync = async (
  masterId: number,
  title: string
): Promise<void> => {
  await exWithTx("UPDATE master SET title = ? WHERE id = ?", [
    title,
    String(masterId),
  ]);
};

export interface INoticeInterval {
  id: number;
  name: string;
  interval: number[];
}

export const getNoticeIntervals = async (): Promise<INoticeInterval[]> => {
  const noticeIntervals = await exWithReadTx<any[]>(
    "SELECT id, name, interval FROM noticeInterval",
    []
  );
  return noticeIntervals.map((n) => ({
    ...n,
    interval: JSON.parse(n.interval),
  }));
};

interface IRange {
  range: {
    start: number;
    end: number;
  };
}

export const getRangeAsync = async (
  masterId: number
): Promise<IRange | null> => {
  const raw = await exWithReadTx<{ value: string }[]>(
    "SELECT value FROM page WHERE id = ?",
    [String(masterId)]
  );
  if (raw.length === 0) return null;

  const [{ value }] = raw;
  const page = JSON.parse(value);
  return {
    range: {
      start: page.startPage,
      end: page.endPage,
    },
  };
};

export const insertRangeAsync = async (masterId: number, range: string) => {
  await exWithTx("INSERT INTO page (id, value) values (?, ?)", [
    String(masterId),
    range,
  ]);
};

export const updateRangeAsync = async (masterId: number, range: string) => {
  await exWithTx("UPDATE page SET value = ? WHERE id = ?", [
    range,
    String(masterId),
  ]);
};

export const deleteRangeAsync = async (masterId: number) => {
  await exWithTx("DELETE FROM page WHERE id = ?", [String(masterId)]);
};

type IMemo = string;

export const getMemoAsync = async (masterId: number): Promise<IMemo | null> => {
  const raw = await exWithReadTx<{ value: string }[]>(
    "SELECT value FROM memo WHERE id = ?",
    [String(masterId)]
  );
  if (raw.length === 0) return null;

  const [{ value }] = raw;
  return value;
};

export const insertMemoAsync = async (masterId: number, memo: string) => {
  await exWithTx("INSERT INTO memo (id, value) values (?, ?)", [
    String(masterId),
    memo,
  ]);
};

export const updateMemoAsync = async (masterId: number, memo: string) => {
  await exWithTx("UPDATE memo SET value = ? WHERE id = ?", [
    memo,
    String(masterId),
  ]);
};

export const deleteMemoAsync = async (masterId: number) => {
  await exWithTx("DELETE FROM memo WHERE id = ?", [String(masterId)]);
};

type NoticeData = {
  notificationId: string;
  noticeDate: string;
};

// "SELECT * FROM notice WHERE noticeDate >= ? AND noticeDate < ? AND done = 1"
export const getNoticesOnlyFutureAndNotComplete = async (
  masterId: number,
  targetDate: string
): Promise<NoticeData[] | null> => {
  const raw = await exWithReadTx<NoticeData[]>(
    "SELECT notificationId, noticeDate FROM notice WHERE done = 1 AND notificationId IS NOT NULL AND id = ? AND noticeDate > ?",
    [String(masterId), targetDate]
  );
  if (raw.length === 0) return null;
  return raw;
};

// notice Table について
// done:  0:success, 1:not yet.
export const updateNoticeAsync = async (masterId: number, targetDate: string): Promise<void> => {
  await exWithTx("UPDATE notice SET done = 0 WHERE id = ? AND noticeDate = ?", [String(masterId), targetDate]);
}