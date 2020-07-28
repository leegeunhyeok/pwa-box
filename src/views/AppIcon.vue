<template>
  <div class="app-icon">
    <div class="app-icon__title">
      {{ title.main }}
      <div class="app-icon__title--sub">{{ title.sub }}</div>
    </div>
    <div class="app-icon__wrap">
      <transition name="fade" mode="out-in">
        <div id="container" v-if="loaded" />
        <div v-else>
          <label for="icon_file">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-upload"
              width="40%"
              height="40%"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
              <polyline points="7 9 12 4 17 9" />
              <line x1="12" y1="4" x2="12" y2="16" />
            </svg>
          </label>
          <input id="icon_file" type="file" accept="image/jpeg, image/png" />
        </div>
      </transition>
    </div>
    <div class="app-icon__size" :class="loaded ? null : 'hide'">
      <span
        v-for="icon in sizeList"
        @click="sizeToggleHandler(icon.size)"
        :class="icon.active ? 'active' : null"
        :key="icon.size"
      >
        {{ icon.size }}
      </span>
    </div>
    <Button color="blue" :disabled="!loaded" @click="nextHandler">Next</Button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Konva from 'konva';
import { ref, reactive, onMounted, toRefs } from '@vue/composition-api';
import { useStore } from '@/store';
import Routeable from '@/mixins/Routeable';
import Button from '@/components/Button.vue';

import std from '@/data/standard';

const TITLE = {
  upload: {
    main: 'Upload app icon',
    sub: '512x512 size recommended.',
  },
  edit: {
    main: 'Edit icon',
    sub: '',
  },
};

const initStage = (image: HTMLImageElement) => {
  const stage = new Konva.Stage({
    container: 'container',
    width: std.maxIconSize,
    height: std.maxIconSize,
  });

  const layer = new Konva.Layer();

  const androidBackground = new Konva.Rect({
    x: 0,
    y: 0,
    width: std.maxIconSize,
    height: std.maxIconSize,
    fill: '#ffffff',
    radius: 16,
  });

  const iOSBackground = new Konva.Rect({
    x: 0,
    y: 0,
    width: std.maxIconSize,
    height: std.maxIconSize,
    fill: '#ffffff',
  });

  const iconPadding = 50;
  const initSize = std.maxIconSize - iconPadding * 2;
  const icon = new Konva.Image({
    image,
    x: iconPadding,
    y: iconPadding,
    width: initSize,
    height: initSize,
    draggable: true,
  });

  const transformer = new Konva.Transformer({
    borderStroke: '#408cea',
    anchorStroke: '#408cea',
    centeredScaling: true,
  });
  transformer.attachTo(icon);

  stage.add(layer);
  layer.add(androidBackground);
  layer.add(iOSBackground);
  layer.add(icon);
  layer.add(transformer);
  layer.draw();

  const fit = () => {
    const container = document.getElementById('container') as HTMLElement;
    const containerWidth = container.offsetWidth;
    const scale = containerWidth / std.maxIconSize;
    stage.width(std.maxIconSize * scale);
    stage.height(std.maxIconSize * scale);
    stage.scale({ x: scale, y: scale });
    stage.draw();
  };

  const toImage = () => {
    const backgroundList = [
      {
        id: 'android',
        background: androidBackground,
      },
      {
        id: 'iOS',
        background: iOSBackground,
      },
    ];
    transformer.visible(false);

    return Promise.all(
      backgroundList.map(({ id, background }) => {
        backgroundList.forEach(({ background }) => background.visible(false));
        background.visible(true);
        return new Promise(resolve => {
          stage.toImage({
            quality: 1,
            callback(image) {
              resolve({ id, src: image.src });
            },
          });
        });
      }),
    );
  };

  fit();

  return {
    toImage,
    fit,
  };
};

const useFileloader = () => {
  const loaded = ref(false);
  const fileHandler = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const [file] = target.files as FileList;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const target = event.target as FileReader;
      const image = new Image();
      image.src = (target.result as ArrayBuffer).toString();
      image.onload = () => {
        loaded.value = true;
        Vue.nextTick(() => initStage(image));
      };
    };
    reader.readAsDataURL(file);
  };

  return { loaded, fileHandler };
};

const useIconList = () => {
  const initList = std.iconSize.map(icon => {
    return { size: icon.size, active: !!icon.recommend };
  });
  const list = reactive({ list: initList });
  return toRefs(list);
};

export default {
  name: 'AppIcon',
  components: {
    Button,
  },
  setup() {
    const store = useStore();
    const title = reactive({
      ...TITLE.upload,
    });
    const { toNext } = Routeable();
    const { loaded, fileHandler } = useFileloader();
    const { list } = useIconList();

    const onChange = (e: Event) => {
      title.main = TITLE.edit.main;
      title.sub = TITLE.edit.sub;
      fileHandler(e);
    };

    onMounted(() => {
      const file = document.getElementById('icon_file') as HTMLElement;
      file.addEventListener('change', onChange);
    });

    const sizeToggleHandler = (size: number) => {
      const icon = list.value.find(icon => icon.size === size);
      if (icon) {
        icon.active = !icon.active;
      }
    };

    const nextHandler = () => {
      // TODO: Save b64 image data to Vuex store.
      const file = document.getElementById('icon_file') as HTMLElement;
      file.removeEventListener('change', onChange);
      toNext('/');
    };

    return {
      title,
      loaded,
      sizeList: list,
      sizeToggleHandler,
      nextHandler,
    };
  },
};
</script>

<style lang="scss">
@import '@/styles/common';
@import '@/styles/effects';

@include theme {
  .app-icon {
    @include container;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: t('background');

    &__title {
      font-size: 1.4rem;
      font-weight: bold;
      margin-bottom: 1rem;

      &--sub {
        font-size: 0.9rem;
        font-weight: lighter;
        color: #999;
      }
    }

    &__wrap {
      width: 300px;
      height: 300px;
      border-radius: 16px;
      border: 1px solid #ddd;
      overflow: hidden;

      @include screen-size(lg) {
        width: 200px;
        height: 200px;
      }

      div {
        width: 100%;
        height: 100%;

        .konvajs-content {
          width: 100% !important;
          height: auto !important;
          margin: auto;
        }

        label {
          cursor: pointer;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background-color: t('background');
          @include transition(background-color, 0.2s);

          svg {
            stroke: t('accent');
          }

          &:hover {
            background-color: darken(t('background'), 10%);
          }
        }

        input[type='file'] {
          outline: none;
          display: none;
        }
      }
    }

    &__size {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      width: 100%;
      max-width: 500px;
      padding-top: 1rem;
      overflow-x: auto;
      overflow-y: hidden;
      max-height: 100px;
      @include transition(max-height, 0.5s);

      @include screen-size(sm) {
        max-width: 100%;
      }

      span {
        cursor: pointer;
        padding: 0.5rem 1rem;
        background-color: $gray;
        border-radius: 6px;
        @include transition(background-color, 0.2s);

        &.active {
          background-color: $green;
          color: #fff;

          &:hover {
            background-color: darken($green, 10%);
          }
        }

        &:hover {
          background-color: darken($gray, 10%);
        }
      }

      &.hide {
        max-height: 0px;
      }
    }

    button {
      margin-top: 2rem;
    }
  }
}
</style>
