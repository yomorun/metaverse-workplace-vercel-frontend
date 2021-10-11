import Head from 'next/head'
import dynamic from 'next/dynamic'
import Floors from '../components/floors'
import Guide from '../components/guide'

const Scene = dynamic(
    () => import('../components/scene'),
    { ssr: false }
)

export default function Floor5() {
    const bgW = 1200
    const bgH = 675
    const playerDiameter = 128
    const wallThickness = 10
    return (
        <>
            <Head>
                <title>Live Meeting Floor</title>
            </Head>
            <div className='w-screen h-screen flex justify-center items-center bg-black min-w-1300'>
                <Scene
                    floor='floor4'
                    backgroundImage='/bg-floor-4.png'
                    boundary={{
                        top: wallThickness,
                        left: wallThickness,
                        bottom: bgH - playerDiameter - wallThickness,
                        right: bgW - playerDiameter - wallThickness
                    }}
                    playerInitialPosition={{ x: 30, y: 60 }}
                />
            </div>
            <Floors currentPath='floor4' />
            <Guide />
        </>
    )
}
