import Konva from 'konva';
import { IconTarget } from './enums';

const THREHSOLD = 0.2;

interface ImageSize {
  width: number;
  height: number;
}

interface BackgroundConfig {
  color: string;
  radius?: number;
}

export interface Image {
  tag: IconTarget | string;
  src: string;
}

export class ImageGenerator {
  private container?: HTMLDivElement;
  private image?: HTMLImageElement;
  private stage?: Konva.Stage;
  private backgroundLayer?: Konva.Layer;
  private iconLayer?: Konva.Layer;
  private background?: Konva.Rect;
  private icon?: Konva.Image;

  // Base image size
  private size: ImageSize;
  private minSize: number;
  private maxSize: number;

  constructor(size: ImageSize) {
    this.size = size;
    this.minSize = Math.floor(this.size.width * 1 - THREHSOLD); // Max 80%
    this.maxSize = Math.floor(this.size.width * THREHSOLD); // Min 20%
  }

  init(container: HTMLDivElement, image: HTMLImageElement) {
    this.container = container;
    this.image = image;
    this.stage = new Konva.Stage({
      container: this.container,
      width: this.size.width,
      height: this.size.height,
    });

    this.background = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.size.width,
      height: this.size.height,
      fill: '#ffffff',
    });
    this.backgroundLayer = new Konva.Layer();
    this.backgroundLayer.add(this.background);
    this.backgroundLayer.draw();

    const iconPaddingLeft = Math.floor((this.size.width - this.maxSize) / 2);
    const iconPaddingTop = Math.floor((this.size.height - this.maxSize) / 2);
    this.icon = new Konva.Image({
      image: this.image,
      x: iconPaddingLeft,
      y: iconPaddingTop,
      width: this.maxSize,
      height: this.maxSize,
    });
    this.iconLayer = new Konva.Layer();
    this.iconLayer.add(this.icon);
    this.iconLayer.draw();

    this.stage.add(this.backgroundLayer);
    this.stage.add(this.iconLayer);
    this.stage.draw();
  }

  updateIconSize(value: number) {
    //@typescript-eslint/no-non-null-assertion
    const scope = this.maxSize - this.minSize;
    const targetSize = this.minSize + scope * value;
    const iconPaddingLeft = Math.floor((this.size.width - targetSize) / 2);
    const iconPaddingTop = Math.floor((this.size.height - targetSize) / 2);
    this.icon!.width(targetSize);
    this.icon!.height(targetSize);
    this.icon!.x(iconPaddingLeft);
    this.icon!.y(iconPaddingTop);
    this.iconLayer!.draw();
  }

  updateBackground(config: BackgroundConfig) {
    this.background!.fill(config.color || '#ffffff');
    this.background!.cornerRadius(config.radius || 0);
  }

  toData(size: ImageSize) {
    return new Promise(resolve => {
      const stage = this.stage!.clone(null);
      stage.size({ ...size });
      stage.toImage({
        quality: 1,
        callback(image: HTMLImageElement) {
          resolve(image.src);
        },
      });
    });
  }
}
