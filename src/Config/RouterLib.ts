import {ScreenKey} from "./Const";

export const resetToHome = (navigation: any) => navigation.reset({
  index: 0,
  routes: [{ name: ScreenKey.Home }],
});
