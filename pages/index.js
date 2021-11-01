import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import Sidebar from '../components/minor/sidebar'
import FloorLinks from '../components/minor/floor-links'
import Guide from '../components/minor/guide'
import IframePage from '../components/minor/iframe-page'
import { useSetRecoilState } from 'recoil'
import { locationState, IframePageState } from '../store/atom'

const Scene = dynamic(
    () => import('../components/scene'),
    { ssr: false }
)

export const getServerSideProps = ({ query }) => {
    return {
        props: {
            query
        },
    }
}

export default function Home({ query: { city, country, region } }) {
    const setLocationState = useSetRecoilState(locationState)
    const setIframePageState = useSetRecoilState(IframePageState)

    useEffect(() => {
        setLocationState({ city, country, region })
    }, [])

    return (
        <>
            <Head>
                <title>Open-source Virtual HQ with Geo-distributed System Tech Stacks</title>
            </Head>
            <div className='w-screen h-screen flex justify-center items-center bg-color-home'>
                <Sidebar />
                <Scene
                    className='w-1800px min-w-1800px h-900px wall'
                    floor='home'
                    backgroundImage='/bg-home.png'
                    boundary={{ top: 0, left: 0, bottom: 900, right: 1800 }}
                    checkAreaList={[
                        {
                            id: 'area-1',
                            position: {
                                x: 60,
                                y: 630
                            },
                            rectangle: {
                                width: 200,
                                height: 200
                            },
                            diameter: 80,
                            iframeSrc: 'https://rustpad.io/#yomo'
                        },
                        {
                            id: 'area-2',
                            position: {
                                x: 640,
                                y: 80
                            },
                            circle: {
                                diameter: 200,
                            },
                            iframeSrc: 'https://composing.studio/yomo'
                        },
                    ]}
                    onEnterCheckArea={(area) => {
                        console.log('[enter area]:', area)
                        setIframePageState({
                            isOpen: true,
                            iframeSrc: area.iframeSrc
                        })
                    }}
                    onLeaveArea={() => {
                        console.log('[leave area]')
                        setIframePageState({
                            isOpen: false,
                            iframeSrc: ''
                        })
                    }}
                />
                <FloorLinks currentPath='/' />
                <Guide />
                <IframePage />
            </div>
        </>
    )
}

Home.auth = true
Home.scale = {
    sceneWidth: 1800,
    sceneHeight: 900
}
