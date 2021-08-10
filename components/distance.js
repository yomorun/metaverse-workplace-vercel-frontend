import { useState, useEffect, memo } from 'react'
import cn from 'classnames'

const Distance = ({ calcDistanceCount, elementIdPrefix, meId, matesIdList }) => {
    const [distanceList, setDistanceList] = useState([])

    useEffect(() => {
        const result = []
        const meBox = document.getElementById(elementIdPrefix + meId)
        for (let i = 0; i < matesIdList.length; i++) {
            const mateId = matesIdList[i]
            const mateBox = document.getElementById(elementIdPrefix + mateId)
            if (mateBox && meBox) {
                const { left: x1, top: y1 } = meBox.getBoundingClientRect()
                const { left: x2, top: y2 } = mateBox.getBoundingClientRect()
                const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
                result.push({
                    name: mateId,
                    value: distance << 0
                })
            }
        }

        setDistanceList(result)
    }, [matesIdList])

    if (distanceList.length < 1) {
        return null
    }

    return (
        <div className='z-10 fixed right-4 bottom-1/2 bg-gradient-to-b from-purple-200 via-pink-200 to-red-200 rounded-md shadow-lg'>
            <p className='p-2 text-sm text-center text-black font-bold'>The distance between me and other partners:</p>
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
                                    cn({
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
    return prevProps.calcDistanceCount === nextProps.calcDistanceCount
        && prevProps.matesIdList.length === nextProps.matesIdList.length
}

export default memo(Distance, areEqual)
