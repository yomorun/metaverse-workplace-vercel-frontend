import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import CookieConsent from 'react-cookie-consent'

import Sidebar from '../components/minor/sidebar'
import FloorLinks from '../components/minor/floor-links'
import Guide from '../components/minor/guide'
import IframePage from '../components/minor/iframe-page'

import { useSetRecoilState } from 'recoil'
import { locationState, iframePageState } from '../store/atom'

import type { Page, Location, Area } from '../types'

const Scene = dynamic(() => import('../components/scene'), { ssr: false })

export const getServerSideProps = ({ query }: { query: { country: string; region: string } }) => {
    return {
        props: {
            ...query,
        },
    }
}

const Home: Page<Location> = ({ country, region }) => {
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
            <div className='w-screen h-screen flex justify-center items-center bg-color-newyear'>
                <CookieConsent
                    debug
                    location='top'
                    buttonText='Accept'
                    style={{
                        width: '50%',
                        marginLeft: '25%',
                        marginTop: '5px',
                        backgroundColor: 'rgba(51,59,97,0.8)',
                        fontSize: '18px',
                        border: '4px solid #333B61',
                        color: 'rgb(238,207,74)',
                    }}
                    buttonStyle={{
                        backgroundColor: '#5AB18F',
                        color: '#303756',
                        fontWeight: 700,
                    }}
                >
                    This website uses cookies to enhance the user experience.
                </CookieConsent>
                <Sidebar />
                <Scene
                    className='w-1800px min-w-1800px h-900px'
                    floor='home'
                    backgroundImage='/bg-home-1024stars.png'
                    boundary={{ top: 0, left: 0, bottom: 900, right: 1800 }}
                    playerInitialPosition={{ x: 30, y: 60 }}
                    checkAreaList={[
                        {
                            id: 'area-1',
                            position: {
                                x: 820,
                                y: 550,
                            },
                            rectangle: {
                                width: 300,
                                height: 200,
                            },
                            iframeSrc: 'https://github.com/yomorun/yomo',
                        },
                        {
                            id: 'area-2',
                            position: {
                                x: 1330,
                                y: 340,
                            },
                            round: {
                                diameter: 100,
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
