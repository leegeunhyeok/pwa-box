enum iconTarget {
  COMMON,
  APPLE,
  ANDROID,
  OTHER,
}

interface IconInformation {
  size: number;
  target: iconTarget;
  recommend?: boolean;
}

interface Standard {
  maxIconSize: number;
  iconSize: IconInformation[];
}

const standard: Standard = {
  maxIconSize: 512,
  iconSize: [
    {
      size: 72,
      target: iconTarget.COMMON,
    },
    {
      size: 96,
      target: iconTarget.COMMON,
    },
    {
      size: 128,
      target: iconTarget.COMMON,
    },
    {
      size: 144,
      target: iconTarget.COMMON,
    },
    {
      size: 192,
      target: iconTarget.COMMON,
      recommend: true,
    },
    {
      size: 512,
      target: iconTarget.COMMON,
      recommend: true,
    },
  ],
};

export default standard;
