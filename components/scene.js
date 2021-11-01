import dynamic from 'next/dynamic'
import cn from 'classnames'

import { useRecoilValue } from 'recoil'
import { smallDeviceState, scaleState, meState } from '../store/atom'

import Me from './player/me'
import Mates from './player/mates'
import useSocket from './hooks/use-socket'

const CheckArea = dynamic(() => import('./check-area'))

const Scene = ({
    className, floor, backgroundImage,
    playerInitialPosition = { x: 60, y: 60 },
    boundary = { top: 0, left: 0, bottom: 1000, right: 1600 },
    checkAreaList = [], onEnterCheckArea, onLeaveArea
}) => {
    const smallDevice = useRecoilValue(smallDeviceState)
    const scale = useRecoilValue(scaleState)
    const me = useRecoilValue(meState)

    const socket = useSocket({
        me,
        position: playerInitialPosition,
        room: floor
    })

    if (!socket) {
        return null
    }

    return (
        <div
            className={
                cn(`relative ${className} sm:w-full sm:min-w-full sm:h-full sm:overflow-y-scroll`, {
                    [`${scale.className}`]: scale.value !== 1 && !smallDevice
                })
            }
        >
            {!smallDevice && <img className='absolute top-0 left-0 w-full h-full' src={backgroundImage} alt='background' />}
            {!smallDevice && checkAreaList &&
                <CheckArea
                    socket={socket}
                    checkAreaList={checkAreaList}
                    onEnterCheckArea={onEnterCheckArea}
                    onLeaveArea={onLeaveArea}
                />
            }
            <div className='relative w-full h-full sm:h-auto sm:pb-10 sm-grid'>
                <Mates socket={socket} />
                <Me
                    name={me.name}
                    avatar={me.image}
                    initPos={playerInitialPosition}
                    socket={socket}
                    channel={floor}
                    boundary={boundary}
                />
            </div>
        </div>
    )
}

export default Scene
