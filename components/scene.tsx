import dynamic from 'next/dynamic'
import cn from 'classnames'

import Me from './player/me'
import Mates from './player/mates'
import useSocket from './hooks/use-socket'
import Tip from './minor/tip'

import { useRecoilValue } from 'recoil'
import { smallDeviceState, scaleState, meState, locationState } from '../store/atom'

import type { Area, Boundary, Position } from '../types'

const CheckArea = dynamic(() => import('./check-area'))

const Scene = ({
    className,
    floor,
    backgroundImage,
    playerInitialPosition,
    boundary,
    checkAreaList = [],
    onEnterCheckArea,
    onLeaveCheckArea,
}: {
    className: string
    floor: string
    backgroundImage: string
    boundary: Boundary
    playerInitialPosition: Position
    checkAreaList?: Area[]
    onEnterCheckArea?: (area: Area) => void
    onLeaveCheckArea?: () => void
}) => {
    const smallDevice = useRecoilValue(smallDeviceState)
    const scale = useRecoilValue(scaleState)
    const me = useRecoilValue(meState)
    const location = useRecoilValue(locationState)

    const socket = useSocket({
        me,
        position: playerInitialPosition,
        room: floor,
        location
    })

    if (!socket) {
        return null
    }

    return (
        <>
            <div
                className={cn(
                    `relative ${className} sm:w-full sm:min-w-full sm:h-full sm:overflow-y-scroll`,
                    {
                        [`${scale.className}`]: scale.value !== 1 && !smallDevice,
                    }
                )}
            >
                {!smallDevice && (
                    <img
                        className='absolute top-0 left-0 w-full h-full'
                        src={backgroundImage}
                        alt='background'
                    />
                )}
                {!smallDevice && checkAreaList && (
                    <CheckArea
                        checkAreaList={checkAreaList}
                        onEnterCheckArea={onEnterCheckArea}
                        onLeaveCheckArea={onLeaveCheckArea}
                    />
                )}
                <div className='relative w-full h-full sm:h-auto sm:pb-10 sm-grid'>
                    <Mates socket={socket} />
                    <Me
                        name={me.name}
                        avatar={me.image}
                        country={location.country}
                        initPos={playerInitialPosition}
                        socket={socket}
                        channel={floor}
                        boundary={boundary}
                    />
                </div>
            </div>
            <Tip />
        </>
    )
}

export default Scene
