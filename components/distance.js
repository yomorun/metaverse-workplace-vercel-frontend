import { useState, useEffect, memo } from 'react'
import cn from 'classnames'
import { Observable } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { calcDistance } from '../libs/lib'

const getCalcResult = (elementIdPrefix, hostPlayerId, matesIdList) => {
    const result = []
    const meBox = document.getElementById(elementIdPrefix + hostPlayerId)
    if (meBox) {
        for (let i = 0; i < matesIdList.length; i++) {
            const mateId = matesIdList[i]
            const mateBox = document.getElementById(elementIdPrefix + mateId)

            if (mateBox) {
                const distance = calcDistance(meBox, mateBox)

                result.push({
                    name: mateId,
                    value: distance
                })
            }
        }
    }

    return result
}

const Distance = ({ elementIdPrefix, hostPlayerId, matesIdList, sock }) => {
    const [distanceList, setDistanceList] = useState([])

    useEffect(() => {
        const movement$ = new Observable(obs => {
            sock.on('movement', mv => {
                obs.next(mv)
            })
        })

        const subscription = movement$.pipe(debounceTime(500)).subscribe(() => {
            const result = getCalcResult(elementIdPrefix, hostPlayerId, matesIdList)
            setDistanceList(result)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [matesIdList])

    if (distanceList.length < 1) {
        return null
    }

    return (
        <div className='z-10 fixed right-4 top-1/2 rounded-md shadow-lg bg-white'>
            <p className='my-2 px-5 text-sm text-black font-bold'>Distance changing event:</p>
            <div className='px-5 text-base font-bold text-center text-black max-h-64 overflow-y-auto'>
                {
                    distanceList.map(item => (
                        <p
                            className='py-1 w-full flex justify-between'
                            key={item.name}
                        >
                            <span>{hostPlayerId} &lt;---&gt; {item.name}</span>
                            <span
                                className={
                                    cn('ml-5', {
                                        'text-green-400': item.value <= 300,
                                        'text-yellow-500': item.value > 300 && item.value <= 700,
                                        'text-red-600': item.value > 700
                                    })
                                }
                            >
                                {item.value}
                            </span>
                        </p>
                    ))
                }
            </div>
        </div>
    )
}

function areEqual(prevProps, nextProps) {
    return prevProps.matesIdList.length === nextProps.matesIdList.length
}

export default memo(Distance, areEqual)
