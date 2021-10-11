import Head from 'next/head'
import dynamic from 'next/dynamic'
import Floors from '../components/floors'
import Guide from '../components/guide'

const Scene = dynamic(
    () => import('../components/scene'),
    { ssr: false }
)

export default function Floor1() {
    const bgW = 1200
    const bgH = 675
    const playerDiameter = 128

    return (
        <>
            <Head>
                <title>Open-source Virtual HQ with Geo-distributed System Tech Stacks</title>
            </Head>
            <div className='w-screen h-screen flex justify-center items-center bg-floor-1 min-w-1300px'>
                <Scene
                    floor='floor1'
                    backgroundImage='/bg-floor-1.png'
                    boundary={{
                        top: 0,
                        left: 0,
                        bottom: bgH - playerDiameter,
                        right: bgW - playerDiameter
                    }}
                    playerInitialPosition={{ x: 30, y: 60 }}
                    anchorAreaList={[
                        {
                            id: 'flowerpot-area',
                            position: {
                                x: 495,
                                y: 405
                            },
                            diameter: 80,
                            iframeSrc: 'https://yomo.run'
                        },
                        {
                            id: 'rustpad-area',
                            position: {
                                x: 420,
                                y: 80
                            },
                            diameter: 120,
                            iframeSrc: 'https://rustpad.io/#vkBcNy'
                        },
                    ]}
                />
            </div>
            <Floors currentPath='floor1' />
            <Guide />
        </>
    )
}
