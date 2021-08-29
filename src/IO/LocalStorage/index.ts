import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LocalStorageIF {
  SetAppVersion: (version: string) => void;
  GetAppVersion: () => Promise<WithTimeStumpType<AppVersionType> | null>;
  SetTutorialStatus: (status: boolean) => void;
  GetTutorialStatus: () => Promise<WithTimeStumpType<TutorialStatus> | null>;
}

enum LSKey {
  AppVersion = "AppVersion",
  TutorialStatus = "TutorialStatus"
}

class LocalStorageImpl implements LocalStorageIF {
  SetAppVersion = async (version: string) => {
    const value = withTimeStump<AppVersionType>({version});
    await AsyncStorage.setItem(LSKey.AppVersion, JSON.stringify(value));
  }
  GetAppVersion = async () => {
    const opt = await AsyncStorage.getItem(LSKey.AppVersion)
    if (opt !== null) {
      const value: WithTimeStumpType<AppVersionType> = JSON.parse(opt);
      return value;
    } else {
      return null;
    }
  }
  SetTutorialStatus = async (status: boolean) => {
    const value = withTimeStump<TutorialStatus>({status});
    await AsyncStorage.setItem(LSKey.TutorialStatus, JSON.stringify(value));
  }
  GetTutorialStatus = async () => {
    const opt = await AsyncStorage.getItem(LSKey.TutorialStatus)
    if (opt !== null) {
      const value: WithTimeStumpType<TutorialStatus> = JSON.parse(opt);
      return value;
    } else {
      return null;
    }
  }
}

export const localStorage = new LocalStorageImpl();

type AppVersionType = {
  version: string
}

type TutorialStatus = {
  status: boolean
}

type WithTimeStumpType<T> = {
  [key: string]: T | Date,
  updatedAt: Date,
}

function withTimeStump<T>(value: T): WithTimeStumpType<T> {
  return {
    ...value,
    updatedAt: new Date()
  }
}