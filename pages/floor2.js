import Head from 'next/head'
import dynamic from 'next/dynamic'
import Floors from '../components/floors'
import Guide from '../components/guide'

const Scene = dynamic(
    () => import('../components/scene'),
    { ssr: false }
)

export default function Floor2() {
    const bgW = 1200
    const bgH = 675
    const playerDiameter = 128

    return (
        <>
            <Head>
                <title>Open-source Virtual HQ with Geo-distributed System Tech Stacks</title>
            </Head>
            <div className='w-screen h-screen flex justify-center items-center bg-floor-2 min-w-1300px'>
                <Scene
                    floor='floor2'
                    backgroundImage='/bg-floor-2.png'
                    boundary={{
                        top: 0,
                        left: 0,
                        bottom: bgH - playerDiameter,
                        right: bgW - playerDiameter
                    }}
                    playerInitialPosition={{ x: 30, y: 60 }}
                />
            </div>
            <Floors currentPath='floor2' />
            <Guide />
        </>
    )
}
