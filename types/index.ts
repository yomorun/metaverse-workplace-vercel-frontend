import type { NextPage } from 'next'
import type { IRemoteVideoTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng'

export interface Area {
    id: string
    position: {
        x: number
        y: number
    }
    rectangle?: {
        width: number
        height: number
    }
    round?: {
        diameter: number
    }
    iframeSrc: string
    entered?: boolean
}

export type Scale = { 
    sceneWidth: number
    sceneHeight: number
}

export type Page<T> = NextPage<T> & {
    auth: boolean
    scale: Scale
}

export interface Location {
    country: string
    region: string
}

export interface User {
    name: string
    image: string
}

export interface Position {
    x: number
    y: number
}

export interface Boundary {
    top: number
    left: number
    bottom: number
    right: number
}

export type Mate = {
    name: string
    avatar: string
    pos: Position
    country: string
}

export type TrackMapValue = {
    videoTrack: IRemoteVideoTrack | null
    audioTrack: IRemoteAudioTrack | null
}
