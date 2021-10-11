import { useEffect, useState, useRef, useCallback, memo } from 'react'
import { Observable } from 'rxjs'
import { scan } from 'rxjs/operators'

import { Vector } from '../libs/movement'
import { Logger, isMobile } from '../libs/lib'

import Sound from './sound'

const Mate = ({ name, avatar, initPos, sock, videoTrack, audioTrack, hostPlayerId }) => {
    const refContainer = useRef(null)

    useEffect(() => {
        const log = new Logger(`Mate:${name}`, 'color: white; background: orange')

        const _isMobile = isMobile()

        // default position
        const POS = new Vector(initPos.x || 0, initPos.y || 0)

        if (_isMobile) {
            POS.x = 0
            POS.y = 60
        }

        // Redraw UI
        const renderPosition = (p) => {
            if (refContainer.current) {
                refContainer.current.style = `transform: translate3d(${p.x}px, ${p.y}px, 0);`
            }
        }

        // initial position
        renderPosition(POS)

        const direction$ = new Observable(obs => {
            sock.on('movement', mv => {
                if (mv.name != name || _isMobile) {
                    return
                }

                obs.next(mv.dir)
            })
        })

        // every direction changing event will cause position movement
        const subscription = direction$.pipe(scan((currPos, dir) => currPos.add(dir), POS)).subscribe(renderPosition)

        // Add movement transition, it looks smoother
        setTimeout(() => {
            if (refContainer.current) {
                refContainer.current.classList.add('movement-transition')
            }
        }, 1000)

        return () => {
            log.log('unload')
            subscription.unsubscribe()
        }
    }, [])

    useEffect(() => {
        if (videoTrack) {
            videoTrack.play(`stream-player-${name}`)
        }
    }, [videoTrack])

    return (
        <div className='absolute sm:relative max-h-40' ref={refContainer}>
            <div className='relative w-32 h-32 sm:w-28 sm:h-28 transition duration-500 ease-in-out transform-gpu hover:scale-200'>
                <div className='w-full h-full rounded-full overflow-hidden transform translate-0 shadow-lg'>
                    <div id={`stream-player-${name}`} className='w-full h-full'>
                        {!videoTrack && <img className='w-full h-full' src={avatar} />}
                    </div>
                </div>
                <div
                    className='absolute -top-20 left-0'
                    style={{ display: audioTrack ? 'block' : 'none'}}
                >
                    <Sound
                        audioTrack={audioTrack}
                        elementIdPrefix='stream-player-'
                        hostPlayerId={hostPlayerId}
                        mateId={name}
                        sock={sock}
                    />
                </div>
            </div>
            <div className='mt-4 text-sm text-center text-white font-bold'>{name}</div>
        </div>
    )
}

function areEqual(prevProps, nextProps) {
    let audioTrackIsEqual = false
    if (prevProps.audioTrack && nextProps.audioTrack) {
        audioTrackIsEqual = prevProps.audioTrack._ID === nextProps.audioTrack._ID
    } else {
        audioTrackIsEqual = prevProps.audioTrack == null && nextProps.audioTrack == null
    }

    let videoTrackIsEqual = false
    if (prevProps.videoTrack && nextProps.videoTrack) {
        videoTrackIsEqual = prevProps.videoTrack._ID === nextProps.videoTrack._ID
    } else {
        videoTrackIsEqual = prevProps.videoTrack == null && nextProps.videoTrack == null
    }

    return audioTrackIsEqual && videoTrackIsEqual
}


export default memo(Mate, areEqual)
