import { useState, useEffect, useMemo } from 'react'
import { Observable } from 'rxjs'
import { throttleTime } from 'rxjs/operators'

import { useRecoilValue } from 'recoil'
import { mutedState, mePositionState, matePositionMapState } from '../../store/atom'

import { calcDistance } from '../../libs/helper'

import styles from './sound.module.css'

let positionSubscriber

const Sound = ({ id, audioTrack }) => {
    const [volume, setVolume] = useState(100)
    const muted = useRecoilValue(mutedState)
    const mePosition = useRecoilValue(mePositionState)
    const matePositionMap = useRecoilValue(matePositionMapState)
    const matePosition = matePositionMap.get(id) || { x: 0, y: 0 }

    useEffect(() => {
        if (positionSubscriber) {
            positionSubscriber.next({
                mePosition,
                matePosition
            })
        }
    }, [mePosition, matePosition])

    useEffect(() => {
        if (!audioTrack) {
            return
        }

        const positionObservable = new Observable(subscriber => {
            positionSubscriber = subscriber
        })

        const subscription = positionObservable.pipe(throttleTime(500)).subscribe(({ mePosition, matePosition }) => {
            const distance = calcDistance(mePosition.x, mePosition.y, matePosition.x, matePosition.y)

            // The initial volume is 500, the distance over 50px starts to decay, and stops decaying when it exceeds 1000px
            const maxVolume = 500
            const minDist = 50
            const maxDist = 1000
            const k = maxVolume / (minDist - maxDist)

            let volume = maxVolume
            if (distance <= minDist) {
                volume = maxVolume
            } else if (distance > minDist && distance < maxDist) {
                volume = maxVolume + (distance - minDist) * k
            } else {
                volume = 0
            }

            volume = ~~volume

            audioTrack.setVolume(volume)
            setVolume(volume)
        })

        return () => {
            subscription.unsubscribe()
            positionSubscriber = null
        }
    }, [audioTrack])

    useEffect(() => {
        if (audioTrack) {
            if (muted) {
                audioTrack.stop()
            } else {
                audioTrack.play()
            }
        }
    }, [audioTrack, muted])

    return useMemo(() => (
        <div className='w-32 py-3 rounded-lg shadow-lg bg-white bg-opacity-80 sm:hidden'>
            <div className={`${styles.soundBox} ${muted ? '' : styles.animateSound}`}>
                <span className={styles.line1}></span>
                <span className={styles.line2}></span>
                <span className={styles.line3}></span>
                <span className={styles.line4}></span>
                <span className={styles.line5}></span>
            </div>
            <div className='mt-2 text-sm text-center text-black font-bold'>volume: {volume}%</div>
        </div>
    ), [volume, muted])
}

export default Sound
