import { atom } from 'recoil'

export const smallDeviceState = atom({
  key: 'smallDeviceState',
  default: false,
})

export const scaleState = atom({
  key: 'scaleState',
  default: {
    className: 'scene-scale-100',
    value: 1,
  },
})

export const onlineState = atom({
  key: 'onlineState',
  default: false,
})

export const mutedState = atom({
  key: 'mutedState',
  default: true,
})

export const locationState = atom({
  key: 'locationState',
  default: {
    country: '',
    region: '',
  },
})

export const meState = atom({
  key: 'meState',
  default: {
    name: '',
    image: '',
  },
})

export const mateMapState = atom({
  key: 'mateMapState',
  default: new Map(),
})

export const trackMapState = atom({
  key: 'trackMapState',
  default: new Map(),
})

export const mePositionState = atom({
  key: 'mePositionState',
  default: {
    x: 0,
    y: 0,
  },
})

export const matePositionMapState = atom({
  key: 'matePositionMapState',
  default: new Map(),
})

export const iframePageState = atom({
  key: 'iframePageState',
  default: {
    isOpen: false,
    iframeSrc: '',
  },
})
