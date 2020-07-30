<template>
  <div class="app-icon">
    <div class="app-icon__title">
      {{ title.main }}
      <div class="app-icon__title--sub">{{ title.sub }}</div>
    </div>
    <div class="app-icon__wrap">
      <transition-group name="fade" mode="out-in">
        <div ref="container" v-show="loaded" :key="1" />
        <div v-show="!loaded" :key="2">
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
          <input id="icon_file" type="file" accept="image/jpeg, image/png" @change="onChange" />
        </div>
      </transition-group>
    </div>
    <div class="app-icon__list" :class="loaded ? null : 'hide'">
      <div class="app-icon__size">
        <div
          v-for="icon in sizeList"
          @click="sizeToggleHandler(icon.size)"
          :class="icon.active ? 'active' : null"
          :key="icon.size"
        >
          <div class="app-icon__size__target">
            <span v-if="isTarget(icon.target, 'android')">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-brand-android"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <line x1="3" y1="10" x2="3" y2="16" />
                <line x1="21" y1="10" x2="21" y2="16" />
                <path d="M7 9h10v8a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-8a5 5 0 0 1 10 0" />
                <line x1="8" y1="3" x2="9" y2="5" />
                <line x1="16" y1="3" x2="15" y2="5" />
                <line x1="9" y1="18" x2="9" y2="21" />
                <line x1="15" y1="18" x2="15" y2="21" />
              </svg>
            </span>
            <span v-if="isTarget(icon.target, 'ios')">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-brand-apple"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#ffffff"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path
                  d="M9 7c-3 0-4 3-4 5.5 0 3 2 7.5 4 7.5 1.088-.046 1.679-.5 3-.5 1.312 0 1.5.5 3 .5s4-3 4-5c-.028-.01-2.472-.403-2.5-3-.019-2.17 2.416-2.954 2.5-3-1.023-1.492-2.951-1.963-3.5-2-1.433-.111-2.83 1-3.5 1-.68 0-1.9-1-3-1z"
                />
                <path d="M12 4a2 2 0 0 0 2 -2a2 2 0 0 0 -2 2" />
              </svg>
            </span>
          </div>
          {{ getSizeText(icon.size) }}
          <span class="app-icon__size__recommend" v-if="icon.recommend">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-thumb-up"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#2c3e50"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path
                d="M7 11v 8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
    <Button color="blue" :disabled="!loaded" @click="nextHandler">Next</Button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ref, reactive, onMounted, toRefs, defineComponent } from '@vue/composition-api';
import { useStore } from '@/store';
import { Level, IconTarget } from '@/enums';
import Routeable from '@/mixins/Routeable';
import Button from '@/components/Button.vue';
import std from '@/data/standard';
import Bus from '@/event-bus';

import { IconEditor, IconImage } from '@/editor';

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

const useFileLoader = (onLoadCallback: Function) => {
  const loaded = ref(false);
  const setLoadState = (state: boolean) => {
    loaded.value = state;
  };

  const fileHandler = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const [file] = target.files as FileList;
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      onLoadCallback((event.target as FileReader).result);
    };
    reader.readAsDataURL(file);
  };

  return { loaded, setLoadState, fileHandler };
};

const useIconList = () => {
  const initList = std.icons.map(icon => {
    return {
      size: icon.size,
      recommend: icon.recommend,
      target: icon.target,
      active: !!icon.recommend,
    };
  });

  const list = reactive({ list: initList });
  return toRefs(list);
};

export default defineComponent({
  name: 'AppIcon',
  components: {
    Button,
  },
  setup() {
    const store = useStore();
    const file = ref(null);
    const container = ref(null);
    const { toNext } = Routeable();
    const { list } = useIconList();
    const { init, methods } = IconEditor();
    const { loaded, setLoadState, fileHandler } = useFileLoader((data: ArrayBuffer) => {
      const image = new Image();
      image.src = data.toString();
      image.onload = () => {
        setLoadState(true);
        console.log(container.value);
        Vue.nextTick(() => init({ container: (container.value as unknown) as HTMLElement, image }));
      };
    });
    const title = reactive({
      ...TITLE.upload,
    });

    const onChange = (e: Event) => {
      title.main = TITLE.edit.main;
      title.sub = TITLE.edit.sub;
      fileHandler(e);
    };

    onMounted(() => {
      console.log(container.value);
    });

    const getSizeText = (size: number) => `${size}x${size}`;
    const sizeToggleHandler = (size: number) => {
      const icon = list.value.find(icon => icon.size === size);
      if (icon) {
        icon.active = !icon.active;
      }
    };

    const nextHandler = () => {
      if (!list.value.filter(x => x.active).length) {
        Bus.$emit('@message', {
          message: 'App icon size is required.',
          color: Level.ERROR,
        });
        return;
      }

      if (!methods.toImage) {
        return;
      }

      methods.toImage().then((images: IconImage[]) => {
        images.forEach(image => {
          store.commit('data/SET_ICON', image);
        });

        list.value
          .filter(x => x.active)
          .forEach(({ size }) => {
            store.commit('data/SET_ICON_SIZE', size);
          });

        toNext('/');
      });
    };

    return {
      title,
      loaded,
      file,
      container,
      sizeList: list,
      onChange,
      getSizeText,
      sizeToggleHandler,
      nextHandler,
      isTarget(target: IconTarget, name: string) {
        if (IconTarget.COMMON === target) {
          return true;
        }
        if (name === 'android') {
          return IconTarget.ANDROID === target;
        } else if (name === 'ios') {
          return IconTarget.APPLE === target;
        }
      },
    };
  },
});
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
            background-color: darken(t('background'), 5%);
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
      margin-top: 1rem;
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
      $el: &;

      & > div {
        position: relative;
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

          svg {
            stroke: #fff;
          }
        }

        &:hover {
          background-color: darken(#fff, 10%);
        }
      }

      span {
        svg {
          height: 100%;
          stroke: #ccc;
        }
      }

      &__target {
        position: absolute;
        top: 25%;
        left: 0.8rem;
        height: 50%;
      }

      &__recommend {
        position: absolute;
        top: 25%;
        right: 0.2rem;
        height: 50%;
      }
    }

    button {
      margin-top: 1rem;
    }
  }
}
</style>
