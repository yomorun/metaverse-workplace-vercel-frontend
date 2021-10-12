import { useEffect, memo } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'

import { getRtcToken } from '../libs/request'

const VisitorWebcam = ({ cover, name, rtcJoinedCallback, channel }) => {
    useEffect(() => {
        let rtcClient

        AgoraRTC.setLogLevel(4)
        getRtcToken(name, channel, 'host')
            .then(token => {
                rtcClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

                rtcClient.join(
                    process.env.NEXT_PUBLIC_AGORA_APP_ID,
                    channel,
                    token,
                    name
                ).then(uid => {
                    rtcJoinedCallback && rtcJoinedCallback(rtcClient)
                })
            })
            .catch(error => {
                console.log(error)
            })

        return () => {
            rtcClient && rtcClient.leave()
        }
    }, [])

    return (
        <div className='relative mx-auto w-16 h-16 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-lg bg-white'>
            <img className='w-full h-full' src={cover} alt='avatar' />
        </div>
    )
}

export default memo(VisitorWebcam, () => true)
