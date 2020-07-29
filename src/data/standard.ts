import { IconTarget } from '@/enums';

interface IconInformation {
  size: number;
  target: IconTarget;
  recommend?: boolean;
}

interface Standard {
  maxIconSize: number;
  icons: IconInformation[];
}

const standard: Standard = {
  maxIconSize: 512,
  icons: [
    {
      size: 72,
      target: IconTarget.COMMON,
    },
    {
      size: 96,
      target: IconTarget.COMMON,
    },
    {
      size: 128,
      target: IconTarget.COMMON,
    },
    {
      size: 144,
      target: IconTarget.COMMON,
    },
    {
      size: 180,
      target: IconTarget.APPLE,
      recommend: true,
    },
    {
      size: 192,
      target: IconTarget.ANDROID,
      recommend: true,
    },
    {
      size: 512,
      target: IconTarget.ANDROID,
      recommend: true,
    },
  ],
};

export default standard;
