import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Floors from '../components/floors'
import Guide from '../components/guide'
import { getViewportSize } from '../libs/lib'

const Scene = dynamic(
    () => import('../components/scene'),
    { ssr: false }
)

export default function Floor4() {
    const [boundary, setBoundary] = useState(null)

    useEffect(() => {
        const { width, height } = getViewportSize()

        setBoundary({ top: 210, bottom: height - 128, left: 0, right: width - 128 })
    }, [])

    return (
        <>
            <Head>
                <title>Live Meeting Floor</title>
            </Head>
            <div className='fixed top-0 left-0 w-full h-52 bg-blue-600 bg-opacity-30 border-4 rounded border-blue-600 border-dotted'></div>
            {boundary && <Scene floor='floor5' boundary={boundary} initialPosition={{ x: 30, y: 210 }} />}
            <Floors currentPath='floor5' />
            <Guide />
        </>
    )
}
