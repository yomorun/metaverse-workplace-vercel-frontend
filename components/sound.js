import { useEffect, useState, useContext } from 'react'
import { Observable } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { Context } from '../context'
import { calcDistance } from '../libs/lib'

import styles from './sound.module.css'

const Sound = ({ audioTrack, elementIdPrefix, hostPlayerId, mateId, sock }) => {
    const [volume, setVolume] = useState(100)

    const { state } = useContext(Context)
    const { muted } = state.sound

    useEffect(() => {
        if (!audioTrack) {
            return
        }

        const movement$ = new Observable(obs => {
            sock.on('movement', mv => {
                if (mv.name === mateId || mv.name === hostPlayerId) {
                    obs.next(mv)
                }
            })
        })

        const subscription = movement$.pipe(debounceTime(500)).subscribe(() => {
            const hostBox = document.getElementById(elementIdPrefix + hostPlayerId)
            const mateBox = document.getElementById(elementIdPrefix + mateId)
            const distance = calcDistance(hostBox, mateBox)
            const diameter = hostBox.offsetWidth

            // When `distance >= 4 * diameter`, the volume is reduced by 10% for each additional distance of `diameter`, until 0%
            const ratio = distance / diameter
            if (ratio <= 1) {
                audioTrack.setVolume(250)
                setVolume(250)
            } else if (ratio <= 2) {
                audioTrack.setVolume(200)
                setVolume(200)
            } else if (ratio <= 3) {
                audioTrack.setVolume(150)
                setVolume(150)
            } else if (ratio <= 4) {
                audioTrack.setVolume(100)
                setVolume(100)
            } else if (ratio <= 5) {
                audioTrack.setVolume(90)
                setVolume(90)
            } else if (ratio <= 6) {
                audioTrack.setVolume(80)
                setVolume(80)
            } else if (ratio <= 7) {
                audioTrack.setVolume(70)
                setVolume(70)
            } else if (ratio <= 8) {
                audioTrack.setVolume(60)
                setVolume(60)
            } else if (ratio <= 9) {
                audioTrack.setVolume(50)
                setVolume(50)
            } else if (ratio <= 10) {
                audioTrack.setVolume(40)
                setVolume(40)
            } else if (ratio <= 11) {
                audioTrack.setVolume(30)
                setVolume(30)
            } else if (ratio <= 12) {
                audioTrack.setVolume(20)
                setVolume(20)
            } else if (ratio <= 13) {
                audioTrack.setVolume(10)
                setVolume(10)
            } else if (ratio <= 14) {
                audioTrack.setVolume(0)
                setVolume(0)
            }
        })

        return () => {
            subscription.unsubscribe()
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

    return (
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
    )
}

export default Sound
