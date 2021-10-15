import Head from 'next/head'
import dynamic from 'next/dynamic'
import Floors from '../components/floors'
import Guide from '../components/guide'

const Scene = dynamic(
    () => import('../components/scene'),
    { ssr: false }
)

export default function Floor5() {
    return (
        <>
            <Head>
                <title>Live Meeting Floor</title>
            </Head>
            <div className='w-screen h-screen flex justify-center items-center bg-black min-w-1700px'>
                <Scene
                    className='w-1600px h-1000px'
                    floor='floor4'
                    backgroundImage='/bg-floor-4.png'
                    playerInitialPosition={{ x: 200, y: 800 }}
                    boundary={{ top: 0, left: 0, bottom: 1000, right: 1600 }}
                    checkPointList={[
                        {
                            id: 'game-icon',
                            position: {
                                x: 340,
                                y: 120
                            },
                            width: 50,
                            icon: './check-point/game.svg',
                            iframeSrc: 'https://www.rteconf.com/2021'
                        },
                        {
                            id: 'event-icon',
                            position: {
                                x: 485,
                                y: 590
                            },
                            width: 50,
                            icon: './check-point/event.svg',
                            iframeSrc: 'https://www.rteconf.com/2021'
                        },
                        {
                            id: 'comment-icon',
                            position: {
                                x: 245,
                                y: 890
                            },
                            width: 50,
                            icon: './check-point/comment.svg',
                            iframeSrc: 'https://www.rteconf.com/2021'
                        },
                        {
                            id: 'robot-icon',
                            position: {
                                x: 1175,
                                y: 300
                            },
                            width: 50,
                            icon: './check-point/robot.svg',
                            iframeSrc: 'https://www.rteconf.com/2021'
                        },
                        {
                            id: 'live-icon',
                            position: {
                                x: 1320,
                                y: 845
                            },
                            width: 50,
                            icon: './check-point/live.svg',
                            iframeSrc: 'https://www.rteconf.com/2021'
                        },
                    ]}
                />
            </div>
            <Floors currentPath='floor4' />
            <Guide />
        </>
    )
}
