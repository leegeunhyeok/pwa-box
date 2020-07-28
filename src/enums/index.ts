export enum RouteDirection {
  INIT = '',
  TO_LEFT = 'route-left',
  TO_RIGHT = 'route-right',
}

export enum StartType {
  QUICK,
  MANUAL,
}

export enum Orientation {
  UNSET = -1,
  LANDSCAPE,
  PORTRAIT,
}

export enum Display {
  UNSET = -1,
  FULLSCREEN,
  STANDALONE,
  MINIMALUI,
  BROWSER,
}

export enum Level {
  DEBUG = '',
  INFO = 'blue',
  SUCCESS = 'green',
  WARNING = 'yellow',
  ERROR = 'red',
  CRITICAL = 'purple',
}
