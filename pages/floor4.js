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

        setBoundary({ top: 0, bottom: height - 128, left: 0, right: width - 128 })
    }, [])

    return (
        <>
            <Head>
                <title>Open-source Virtual HQ with Geo-distributed System Tech Stacks</title>
            </Head>
            <img className='fixed top-0 left-0 w-screen h-screen' src='/floor4.png' alt='' />
             {boundary && <Scene floor='floor4' boundary={boundary} initialPosition={{ x: 30, y: 60 }} />}
            <Floors currentPath='floor4' />
            <Guide />
        </>
    )
}
