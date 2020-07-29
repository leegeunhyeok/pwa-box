import Konva from 'konva';
import std from '@/data/standard';

interface IconEditorConfig {
  containerId: string;
  image: HTMLImageElement;
}

interface IconEditorMethods {
  toImage?: Function;
}

export interface IconImage {
  id: string;
  src: string;
}

export const IconEditor = () => {
  const methods: IconEditorMethods = {
    toImage: undefined,
  };

  const init = (config: IconEditorConfig) => {
    const stage = new Konva.Stage({
      container: config.containerId,
      width: std.maxIconSize,
      height: std.maxIconSize,
    });

    const layer = new Konva.Layer();
    const backgroundConfig = {
      x: 0,
      y: 0,
      width: std.maxIconSize,
      height: std.maxIconSize,
      fill: '#ffffff',
    };
    const backgroundList = [
      {
        id: 'android',
        background: new Konva.Rect({
          ...backgroundConfig,
          radius: 16,
        }),
      },
      {
        id: 'iOS',
        background: new Konva.Rect(backgroundConfig),
      },
    ];

    const iconPadding = 50;
    const initSize = std.maxIconSize - iconPadding * 2;
    const icon = new Konva.Image({
      image: config.image,
      x: iconPadding,
      y: iconPadding,
      width: initSize,
      height: initSize,
      draggable: true,
    });

    const transformer = new Konva.Transformer({
      borderStroke: '#aaa',
      anchorStroke: '#408cea',
      centeredScaling: true,
    });
    transformer.attachTo(icon);

    backgroundList.forEach(({ background }) => layer.add(background));
    layer.add(icon);
    layer.add(transformer);
    layer.draw();
    stage.add(layer);

    (() => {
      const container = document.getElementById('container') as HTMLElement;
      const containerWidth = container.offsetWidth;
      const scale = containerWidth / std.maxIconSize;
      stage.width(std.maxIconSize * scale);
      stage.height(std.maxIconSize * scale);
      stage.scale({ x: scale, y: scale });
      stage.draw();
    })();

    methods.toImage = (): Promise<IconImage[]> => {
      transformer.visible(false);
      return Promise.all(
        backgroundList.map(({ id, background }) => {
          backgroundList.forEach(({ background }) => background.visible(false));
          background.visible(true);
          return new Promise<IconImage>(resolve => {
            stage.toImage({
              quality: 1,
              callback(image) {
                resolve({ id, src: image.src });
              },
            });
          });
        }),
      ).finally(() => {
        transformer.visible(true);
      });
    };
  };

  return { init, methods };
};
