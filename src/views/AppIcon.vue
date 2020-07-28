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
    <div class="app-icon__list" :class="loaded ? null : 'hide'">
      <div class="app-icon__size">
        <span
          v-for="icon in sizeList"
          @click="sizeToggleHandler(icon.size)"
          :class="icon.active ? 'active' : null"
          :key="icon.size"
        >
          {{ getSizeText(icon.size) }}
        </span>
      </div>
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
    borderStroke: '#aaa',
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

    const getSizeText = (size: number) => `${size}x${size}`;
    const sizeToggleHandler = (size: number) => {
      const icon = list.value.find(icon => icon.size === size);
      if (icon) {
        icon.active = !icon.active;
      }
    };

    const nextHandler = () => {
      // TODO: Save b64 image data to Vuex store.
      toNext('/');
    };

    return {
      title,
      loaded,
      sizeList: list,
      getSizeText,
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
      width: 240px;
      height: 240px;
      border-radius: 16px;
      border: 1px solid #ddd;
      overflow: hidden;

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

    &__list {
      max-height: 120px;
      max-width: 240px;
      width: 90%;
      padding: 0 1rem;
      margin-top: 1rem;
      border: 1px solid $gray;
      border-radius: 1rem;
      overflow-y: auto;
      @include transition(max-height, 0.5s);

      &.hide {
        max-height: 0px;
        border: none;
        overflow: hidden;
      }
    }

    &__size {
      padding: 1rem 0;
      padding-bottom: 0.5rem;

      span {
        cursor: pointer;
        display: block;
        padding: 0.5rem 1rem;
        color: #333;
        background-color: $gray;
        text-align: center;
        border-radius: 2rem;
        margin-bottom: 0.5rem;
        @include transition((background-color, 0.2s), (color, 0.2s));

        &.active {
          background-color: $accent;
          color: #fff;

          &:hover {
            background-color: darken($accent, 10%);
          }
        }

        &:hover {
          background-color: darken(#fff, 10%);
        }
      }
    }

    button {
      margin-top: 1rem;
    }
  }
}
</style>
