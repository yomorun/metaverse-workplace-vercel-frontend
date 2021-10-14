import Head from 'next/head'
import dynamic from 'next/dynamic'
import Floors from '../components/floors'
import Guide from '../components/guide'

const Scene = dynamic(
    () => import('../components/scene'),
    { ssr: false }
)

export default function Floor1() {
    return (
        <>
            <Head>
                <title>Open-source Virtual HQ with Geo-distributed System Tech Stacks</title>
            </Head>
            <div className='w-screen h-screen flex justify-center items-center bg-floor-1 min-w-1700px'>
                <Scene
                    showWall
                    floor='floor1'
                    backgroundImage='/bg-floor-1.png'
                    playerInitialPosition={{ x: 30, y: 60 }}
                    anchorAreaList={[
                        {
                            id: 'rte2021-area',
                            position: {
                                x: 680,
                                y: 490
                            },
                            diameter: 80,
                            iframeSrc: 'https://www.rteconf.com/2021'
                        },
                        {
                            id: 'rustpad-area',
                            position: {
                                x: 600,
                                y: 90
                            },
                            diameter: 120,
                            iframeSrc: 'https://rustpad.io/#yomo'
                        },
                        {
                            id: 'rustpad-area-2',
                            position: {
                                x: 600,
                                y: 490
                            },
                            diameter: 160,
                            iframeSrc: 'https://rustpad.io/#yomo'
                        },
                        {
                            id: 'rustpad-area-3',
                            position: {
                                x: 600,
                                y: 180
                            },
                            diameter: 200,
                            iframeSrc: 'https://rustpad.io/#yomo'
                        },
                    ]}
                />
            </div>
            <Floors currentPath='floor1' />
            <Guide />
        </>
    )
}
