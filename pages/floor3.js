import Head from 'next/head'
import dynamic from 'next/dynamic'
import Floors from '../components/floors'
import Guide from '../components/guide'

const Scene = dynamic(
    () => import('../components/scene'),
    { ssr: false }
)

export default function Floor3() {
    return (
        <>
            <Head>
                <title>Open-source Virtual HQ with Geo-distributed System Tech Stacks</title>
            </Head>
            <div className='w-screen h-screen flex justify-center items-center bg-floor-3 min-w-1700px'>
                <Scene
                    className='w-1600px h-800px wall'
                    showDistanceChange
                    floor='floor3'
                    backgroundImage='/bg-floor-3.png'
                    playerInitialPosition={{ x: 600, y: 500 }}
                    boundary={{ top: 0, left: 0, bottom: 800, right: 1600 }}
                />
            </div>
            <Floors currentPath='floor3' />
            <Guide />
        </>
    )
}
