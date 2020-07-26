import { Module, StoreOptions } from 'vuex';
import { RootState } from '@/store';
import { Orientation, Display } from '@/enums';

export interface Size {
  width: number;
  height: number;
}

export interface Icon {
  size: Size;
  src: string;
  type: string;
}

export interface Splash {
  image: string;
  size: Size;
  orienration: Orientation;
}

interface DataState {
  appName: string;
  appShortName: string;
  appIcon: Icon[];
  appThemeColor: string;
  appBackgroundColor: string;
  appSplash: Splash[];
  appOrientation: Orientation;
  appDisplay: Display;
  appStartURL: string;
}

const module: Module<DataState, RootState> = {
  namespaced: true,
  state: {
    appName: '',
    appShortName: '',
    appIcon: [],
    appThemeColor: '',
    appBackgroundColor: '',
    appSplash: [],
    appOrientation: Orientation.UNSET,
    appDisplay: Display.UNSET,
    appStartURL: '',
  },
  mutations: {
    SET_NAME(state, name: string) {
      state.appName = state.appShortName = name;
    },
    SET_ICON(state, icon: IIcon) {
      state.appIcon.push(icon);
    },
    SET_THEME(state, color: string) {
      state.appThemeColor = color;
    },
    SET_BACKGROUND(state, color: string) {
      state.appBackgroundColor = color;
    },
    SET_SPLASH(state, splash: ISplash) {
      state.appSplash.push(splash);
    },
    SET_ORIENTATION(state, orienration: Orientation) {
      state.appOrientation = orienration;
    },
    SET_DISPLAY(state, mode: Display) {
      state.appDisplay = mode;
    },
    SET_START_URL(state, url: string) {
      state.appStartURL = url;
    },
  },
};

export default module;
