import { useState, useEffect, useCallback, useMemo } from 'react'
import AgoraRTC, {
    IAgoraRTCClient,
    ICameraVideoTrack,
    IMicrophoneAudioTrack,
    IRemoteVideoTrack,
    IRemoteAudioTrack,
    IRemoteTrack,
} from 'agora-rtc-sdk-ng'
import cn from 'classnames'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import Spin from '../minor/spin'

import { useSetRecoilState, useRecoilValue } from 'recoil'
import { trackMapState, mePositionState, matePositionMapState, tipState } from '../../store/atom'
import { onlineCountState } from '../../store/selector'

import { getRtcToken } from '../../libs/request'
import { calcDistance, checkMobileDevice } from '../../libs/helper'

import type { Position, TrackMapValue } from '../../types'

interface PositionSub {
    mePosition: Position
    matePositionMap: Map<string, Position>
}

const STATE: {
    rtcClient: IAgoraRTCClient | undefined
    videoTrack: ICameraVideoTrack | undefined
    audioTrack: IMicrophoneAudioTrack | undefined
    position$: Subject<PositionSub>
    canJoin: boolean
    joined: boolean
    showTip: boolean
    needToOpenCamera: boolean
    needToOpenMicrophone: boolean
} = {
    rtcClient: undefined,
    videoTrack: undefined,
    audioTrack: undefined,
    position$: new Subject<PositionSub>(),
    canJoin: false,
    joined: false,
    showTip: false,
    needToOpenCamera: false,
    needToOpenMicrophone: false,
}

const join = async (name: string, channel: string) => {
    if (STATE.joined) {
        return Promise.resolve()
    }

    try {
        const token = await getRtcToken(name, channel, 'host')
        if (STATE.rtcClient) {
            await STATE.rtcClient.join(
                process.env.NEXT_PUBLIC_AGORA_APP_ID as string,
                channel,
                token,
                name
            )
            STATE.joined = true
            return Promise.resolve()
        }
        return Promise.reject('The value of `rtcClient` is undefined')
    } catch (error) {
        STATE.joined = false
        return Promise.reject(error)
    }
}

const leave = () => {
    if (STATE.rtcClient) {
        STATE.rtcClient.leave()
        STATE.joined = false
        STATE.canJoin = false
    }
}

const createCameraVideoTrack = (name: string, channel: string, cb?: () => void) => {
    join(name, channel).then(() => {
        AgoraRTC.createCameraVideoTrack().then(track => {
            STATE.videoTrack = track

            // Plays a local video track on the web page.
            track.play(`stream-player-${name}`)

            // Publishes a Local Stream
            const { rtcClient } = STATE
            rtcClient && rtcClient.publish(track)

            cb && cb()
        })
    })
}

const createMicrophoneAudioTrack = (name: string, channel: string, cb?: () => void) => {
    join(name, channel).then(() => {
        AgoraRTC.createMicrophoneAudioTrack().then(track => {
            STATE.audioTrack = track

            const { rtcClient } = STATE
            rtcClient && rtcClient.publish(track)

            cb && cb()
        })
    })
}

const clearVideoTrack = () => {
    const { videoTrack } = STATE
    if (videoTrack) {
        // Unpublishes the Local Stream.
        const { rtcClient } = STATE
        rtcClient && rtcClient.unpublish(videoTrack)
        // Stops playing the media track.
        videoTrack.stop()
        // Closes a local track and releases the video resources that it occupies.
        // Once you close a local track, you can no longer reuse it.
        videoTrack.close()
        STATE.videoTrack = undefined
    }
}

const clearAudioTrack = () => {
    const { audioTrack } = STATE
    if (audioTrack) {
        const { rtcClient } = STATE
        rtcClient && rtcClient.unpublish(audioTrack)
        audioTrack.close()
        STATE.audioTrack = undefined
    }
}

const toggleTip = () => {
    const webcamBox = document.getElementById('me-webcam-box')
    if (webcamBox) {
        if (STATE.showTip) {
            STATE.showTip = false
            webcamBox.classList.remove('ring-cannot-join')
        } else {
            STATE.showTip = true
            webcamBox.classList.add('ring-cannot-join')
        }
    }
}

const Webcam = ({ cover, name, channel }: { cover: string; name: string; channel: string }) => {
    const [videoOn, setVideoOn] = useState(false)
    const [micOn, setMicOn] = useState(false)
    const [loading, setLoading] = useState(false)

    const setTrackMapState = useSetRecoilState(trackMapState)
    const setTipState = useSetRecoilState(tipState)

    const mePosition = useRecoilValue(mePositionState)
    const matePositionMap = useRecoilValue(matePositionMapState)
    const onlineCount = useRecoilValue<number>(onlineCountState)

    useEffect(() => {
        if (checkMobileDevice()) {
            if (onlineCount > 1) {
                if (!STATE.joined) {
                    STATE.canJoin = true
                    join(name, channel)
                    setTipState({
                        isOpen: false,
                        msg: '',
                    })
                }
            } else {
                setTipState({
                    isOpen: true,
                    msg: `No one is around you, so you can't join and publish local streams`,
                })
            }
        }
    }, [onlineCount])

    useEffect(() => {
        STATE.position$.next({
            mePosition,
            matePositionMap,
        })
    }, [mePosition, matePositionMap])

    useEffect(() => {
        if (checkMobileDevice()) {
            return
        }

        const subscription = STATE.position$
            .pipe(debounceTime(300))
            .subscribe(({ mePosition, matePositionMap }) => {
                if (matePositionMap.size === 0) {
                    STATE.canJoin = false
                }

                for (const matePosition of matePositionMap.values()) {
                    const distance = calcDistance(
                        mePosition.x,
                        mePosition.y,
                        matePosition.x,
                        matePosition.y
                    )

                    // Detects if there are people within 400px of the surrounding area. If there is, then you can join
                    if (distance < 300) {
                        STATE.canJoin = true
                        break
                    }

                    STATE.canJoin = false
                }

                // Check if you can join
                if (STATE.canJoin) {
                    // Check if you have joined
                    if (STATE.joined) {
                        const { needToOpenCamera, needToOpenMicrophone } = STATE

                        // If the camera needs to be turned on, turn it on and push the video stream
                        if (needToOpenCamera) {
                            STATE.needToOpenCamera = false
                            setVideoOn(true)
                            setLoading(true)
                            createCameraVideoTrack(name, channel, () => {
                                setLoading(false)
                            })
                        }

                        // If the microphone needs to be turned on, turn it on and push the audio stream
                        if (needToOpenMicrophone) {
                            STATE.needToOpenMicrophone = false
                            setMicOn(true)
                            createMicrophoneAudioTrack(name, channel)
                        }
                    } else {
                        join(name, channel)
                    }

                    // If the prompt is already turned on, close it
                    if (STATE.showTip) {
                        toggleTip()
                    }
                } else {
                    if (STATE.videoTrack) {
                        // Turn off the camera and cancel the push video stream
                        clearVideoTrack()
                        setVideoOn(false)

                        // Automatically turn on the prompt after closing the camera
                        if (!STATE.showTip) {
                            toggleTip()
                            STATE.needToOpenCamera = true
                        }
                    }

                    if (STATE.audioTrack) {
                        // Turn off the microphone and cancel the push audio stream
                        clearAudioTrack()
                        setMicOn(false)

                        // Automatically turn on the prompt after turning off the microphone
                        if (!STATE.showTip) {
                            toggleTip()
                            STATE.needToOpenMicrophone = true
                        }
                    }
                }
            })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    useEffect(() => {
        AgoraRTC.setLogLevel(4)

        AgoraRTC.onAutoplayFailed = () => {
            setTipState({
                isOpen: true,
                msg: 'Click me to resume the audio/video playback',
            })
        }

        STATE.rtcClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

        const setTrack = (
            id: string,
            mediaType: 'audio' | 'video',
            trackObject: IRemoteTrack | null
        ) => {
            setTrackMapState(old => {
                const trackMap = new Map(old)
                const track: TrackMapValue = trackMap.get(id) || {
                    videoTrack: null,
                    audioTrack: null,
                }
                track[`${mediaType}Track`] = trackObject as
                    | (IRemoteVideoTrack & IRemoteAudioTrack)
                    | null
                if (!trackMap.has(id)) {
                    trackMap.set(id, track)
                }
                return trackMap
            })
        }

        STATE.rtcClient.on('user-published', (remoteUser, mediaType) => {
            const { rtcClient } = STATE
            if (rtcClient) {
                rtcClient.subscribe(remoteUser, mediaType).then((track: IRemoteTrack) => {
                    setTrack(remoteUser.uid as string, mediaType, track)
                })
            }
        })

        STATE.rtcClient.on('user-unpublished', (remoteUser, mediaType) => {
            setTrack(remoteUser.uid as string, mediaType, null)
        })

        return () => {
            clearVideoTrack()
            clearAudioTrack()
            leave()
        }
    }, [])

    const toggleVideoSwitch = useCallback(() => {
        const _videoOn = !videoOn

        // To open the camera, but at this time can not join, then open the prompt
        if (_videoOn && !STATE.canJoin) {
            toggleTip()
            STATE.needToOpenCamera = STATE.showTip
            return
        }

        setVideoOn(_videoOn)

        if (_videoOn) {
            setLoading(true)
            createCameraVideoTrack(name, channel, () => {
                setLoading(false)
            })
        } else {
            clearVideoTrack()
        }
    }, [videoOn])

    const toggleMicSwitch = useCallback(() => {
        const _micOn = !micOn

        // To open the microphone, but can not join at this time, then open the prompt
        if (_micOn && !STATE.canJoin) {
            toggleTip()
            STATE.needToOpenMicrophone = STATE.showTip
            return
        }

        setMicOn(_micOn)

        if (_micOn) {
            createMicrophoneAudioTrack(name, channel)
        } else {
            clearAudioTrack()
        }
    }, [micOn])

    return useMemo(
        () => (
            <div
                className='relative mx-auto w-32 h-32 flex flex-col items-center sm:w-28 sm:h-28'
                id='me-webcam-box'
            >
                <div
                    id={`stream-player-${name}`}
                    className='w-full h-full rounded-full overflow-hidden transform translate-0 shadow-lg bg-white'
                >
                    {!videoOn && <img className='w-full h-full' src={cover} alt='me-avatar' />}
                </div>
                <div className='absolute bottom-3 flex'>
                    <div className='cursor-pointer' onClick={toggleVideoSwitch}>
                        <svg
                            className={cn('fill-current text-white rounded-full', {
                                'bg-green-600': videoOn,
                                'bg-red-600': !videoOn,
                            })}
                            width='24'
                            height='24'
                            fill='none'
                            viewBox='0 0 24 24'
                        >
                            <path
                                fill='currentColor'
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d={
                                    videoOn
                                        ? 'M15.1141 9.35688C14.7589 9.56999 14.6438 10.0307 14.8569 10.3859C15.07 10.7411 15.5307 10.8562 15.8859 10.6431L15.1141 9.35688ZM19.25 7.75H20C20 7.4798 19.8547 7.23048 19.6195 7.09735C19.3844 6.96422 19.0958 6.96786 18.8641 7.10688L19.25 7.75ZM19.25 16.25L18.8641 16.8931C19.0958 17.0321 19.3844 17.0358 19.6195 16.9026C19.8547 16.7695 20 16.5202 20 16.25H19.25ZM15.8859 13.3569C15.5307 13.1438 15.07 13.2589 14.8569 13.6141C14.6438 13.9693 14.7589 14.43 15.1141 14.6431L15.8859 13.3569ZM15.8859 10.6431L19.6359 8.39312L18.8641 7.10688L15.1141 9.35688L15.8859 10.6431ZM18.5 7.75V16.25H20V7.75H18.5ZM19.6359 15.6069L15.8859 13.3569L15.1141 14.6431L18.8641 16.8931L19.6359 15.6069ZM6.75 7.5H13.25V6H6.75V7.5ZM14.5 8.75V15.25H16V8.75H14.5ZM13.25 16.5H6.75V18H13.25V16.5ZM5.5 15.25V8.75H4V15.25H5.5ZM6.75 16.5C6.05964 16.5 5.5 15.9404 5.5 15.25H4C4 16.7688 5.23122 18 6.75 18V16.5ZM14.5 15.25C14.5 15.9404 13.9404 16.5 13.25 16.5V18C14.7688 18 16 16.7688 16 15.25H14.5ZM13.25 7.5C13.9404 7.5 14.5 8.05964 14.5 8.75H16C16 7.23122 14.7688 6 13.25 6V7.5ZM6.75 6C5.23122 6 4 7.23122 4 8.75H5.5C5.5 8.05964 6.05964 7.5 6.75 7.5V6Z'
                                        : 'M4.46299 6.05709C4.74324 5.941 5.06583 6.00517 5.28033 6.21967L15.7799 16.7192C15.7802 16.7195 15.7805 16.7198 15.7808 16.7201L17.7803 18.7197C18.0732 19.0126 18.0732 19.4874 17.7803 19.7803C17.4874 20.0732 17.0126 20.0732 16.7197 19.7803L14.9393 18H6.75C5.23122 18 4 16.7688 4 15.25V6.75C4 6.44665 4.18273 6.17318 4.46299 6.05709ZM13.4393 16.5L5.5 8.56066V15.25C5.5 15.9404 6.05964 16.5 6.75 16.5H13.4393ZM13.25 7.5H9.75C9.33579 7.5 9 7.16421 9 6.75C9 6.33579 9.33579 6 9.75 6H13.25C14.758 6 15.9825 7.21381 15.9998 8.71772L18.8823 7.09632C19.1145 6.96569 19.3986 6.96808 19.6286 7.10259C19.8586 7.23711 20 7.48355 20 7.75V16.25C20 16.5164 19.8586 16.7629 19.6286 16.8974C19.3986 17.0319 19.1145 17.0343 18.8823 16.9037L14.8823 14.6537C14.6461 14.5208 14.5 14.271 14.5 14V10.0148C14.4998 10.0054 14.4998 9.99597 14.5 9.98658V8.75C14.5 8.05964 13.9404 7.5 13.25 7.5ZM16 10.4386V13.5614L18.5 14.9676V9.03239L16 10.4386Z'
                                }
                            ></path>
                        </svg>
                    </div>
                    <div className='ml-2 cursor-pointer' onClick={toggleMicSwitch}>
                        <svg
                            className={cn('fill-current text-white rounded-full', {
                                'bg-green-600': micOn,
                                'bg-red-600': !micOn,
                            })}
                            width='24'
                            height='24'
                            fill='none'
                            viewBox='0 0 24 24'
                        >
                            {micOn ? (
                                <>
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='1.5'
                                        d='M8.75 8C8.75 6.20507 10.2051 4.75 12 4.75C13.7949 4.75 15.25 6.20507 15.25 8V11C15.25 12.7949 13.7949 14.25 12 14.25C10.2051 14.25 8.75 12.7949 8.75 11V8Z'
                                    />
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='1.5'
                                        d='M5.75 12.75C5.75 12.75 6 17.25 12 17.25C18 17.25 18.25 12.75 18.25 12.75'
                                    />
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='1.5'
                                        d='M12 17.75V19.25'
                                    />
                                </>
                            ) : (
                                <>
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='1.5'
                                        d='M15.25 8.5V8C15.25 6.20507 13.7949 4.75 12 4.75C10.2051 4.75 8.75 6.20507 8.75 8V11.1802C8.75 11.2267 8.7507 11.2721 8.75373 11.3185C8.77848 11.6975 8.95343 13.5309 10.0312 13.7969'
                                    />
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='1.5'
                                        d='M18.25 12.75C18.25 12.75 18 17.25 12 17.25C11.6576 17.25 11.334 17.2353 11.028 17.2077M5.75 12.75C5.75 12.75 5.85507 14.6412 7.56374 15.9716'
                                    />
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='1.5'
                                        d='M12 17.75V19.25'
                                    />
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='1.5'
                                        d='M18.25 5.75L5.75 18.25'
                                    />
                                </>
                            )}
                        </svg>
                    </div>
                </div>
                {loading && (
                    <div className='absolute w-full h-full flex justify-center items-center'>
                        <Spin />
                        <span className='ml-2 text-base text-black'>loading...</span>
                    </div>
                )}
            </div>
        ),
        [videoOn, micOn, loading]
    )
}

export default Webcam
