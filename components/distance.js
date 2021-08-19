import { useState, useEffect, memo } from 'react'
import cn from 'classnames'
import { calcDistance, debounce } from '../libs/lib'

const getCalcResult = (elementIdPrefix, meId, matesIdList) => {
    const result = []
    const meBox = document.getElementById(elementIdPrefix + meId)
    if (meBox) {
        const radius = meBox.offsetWidth / 2
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

const Distance = ({ elementIdPrefix, meId, matesIdList, sock }) => {
    const [distanceList, setDistanceList] = useState([])

    useEffect(() => {
        const setCalcResult = () => {
            const result = getCalcResult(elementIdPrefix, meId, matesIdList)
            setDistanceList(result)
        }

        const setCalcResultFn = debounce(setCalcResult, 500)
        sock.on('movement', mv => {
            setCalcResultFn()
        })
    }, [matesIdList])

    if (distanceList.length < 1) {
        return null
    }

    return (
        <div className='z-10 fixed left-4 top-1/2 rounded-md shadow-lg bg-white bg-opacity-10'>
            <p className='my-2 px-5 text-sm text-black font-bold'>Distance changing event:</p>
            <div className='px-5 text-base font-bold text-center text-black max-h-64 overflow-y-auto'>
                {
                    distanceList.map(item => (
                        <p
                            className='py-1 w-full flex justify-between'
                            key={item.name}
                        >
                            <span>{meId} &lt;---&gt; {item.name}</span>
                            <span
                                className={
                                    cn('ml-5', {
                                        'text-green-400': item.value <= 300,
                                        'text-yellow-500': item.value > 300 && item.value <= 900,
                                        'text-red-600': item.value > 900
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
