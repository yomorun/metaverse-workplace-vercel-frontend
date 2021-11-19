import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

import Sidebar from '../components/minor/sidebar'
import FloorLinks from '../components/minor/floor-links'
import Guide from '../components/minor/guide'
import IframePage from '../components/minor/iframe-page'

import { useSetRecoilState } from 'recoil'
import { locationState, iframePageState } from '../store/atom'

import type { NextPage } from 'next'
import type { PageAuth, PageSceneScale, Location, Area } from '../types'

const Scene = dynamic(() => import('../components/scene'), { ssr: false })

export const getServerSideProps = ({ query }: any) => {
    return {
        props: {
            country: query.country || '',
            region: query.region || '',
        },
    }
}

const Home: NextPage<Location> & PageAuth & PageSceneScale = ({ country, region }) => {
    const setLocationState = useSetRecoilState(locationState)
    const setIframePageState = useSetRecoilState(iframePageState)

    useEffect(() => {
        setLocationState({ country, region })
    }, [])

    return (
        <>
            <Head>
                <title>
                    Open-source Metaverse Workplace with Geo-distributed System Tech Stacks
                </title>
            </Head>
            <div className='w-screen h-screen flex justify-center items-center bg-color-home'>
                <Sidebar />
                <Scene
                    className='w-1800px min-w-1800px h-900px wall'
                    floor='home'
                    backgroundImage='/bg-home.png'
                    boundary={{ top: 0, left: 0, bottom: 900, right: 1800 }}
                    playerInitialPosition={{ x: 30, y: 60 }}
                    checkAreaList={[
                        {
                            id: 'area-1',
                            position: {
                                x: 60,
                                y: 630,
                            },
                            rectangle: {
                                width: 200,
                                height: 200,
                            },
                            iframeSrc: 'https://github.com/yomorun/yomo',
                        },
                        {
                            id: 'area-2',
                            position: {
                                x: 640,
                                y: 80,
                            },
                            round: {
                                diameter: 200,
                            },
                            iframeSrc: 'https://yomo.run',
                        },
                    ]}
                    onEnterCheckArea={(area: Area) => {
                        console.log('[Enter Area]:', area)
                        setIframePageState({
                            isOpen: true,
                            iframeSrc: area.iframeSrc,
                        })
                    }}
                    onLeaveCheckArea={() => {
                        console.log('[Leave Area]')
                        setIframePageState({
                            isOpen: false,
                            iframeSrc: '',
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
    sceneHeight: 900,
}

export default Home
