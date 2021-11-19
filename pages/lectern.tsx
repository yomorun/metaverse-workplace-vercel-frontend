import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

import Sidebar from '../components/minor/sidebar'
import FloorLinks from '../components/minor/floor-links'
import Guide from '../components/minor/guide'

import { useSetRecoilState } from 'recoil'
import { locationState } from '../store/atom'

import type { NextPage } from 'next'
import type { PageAuth, PageSceneScale, Location } from '../types'

const Scene = dynamic(() => import('../components/scene'), { ssr: false })

export const getServerSideProps = ({ country, region }: Location) => {
    return {
        props: {
            country: country || '',
            region: region || '',
        },
    }
}

const Lectern: NextPage<Location> & PageAuth & PageSceneScale = ({ country, region }) => {
    const setLocationState = useSetRecoilState(locationState)

    useEffect(() => {
        setLocationState({ country, region })
    }, [])

    return (
        <>
            <Head>
                <title>Live Meeting Floor</title>
            </Head>
            <div className='w-screen h-screen flex justify-center items-center bg-black'>
                <Sidebar />
                <Scene
                    className='w-1800px min-w-1800px h-900px sm-bg-lectern'
                    floor='lectern'
                    backgroundImage='/bg-lectern.png'
                    boundary={{
                        top: 20,
                        left: 20,
                        bottom: 900 - 20,
                        right: 1800 - 20,
                    }}
                    playerInitialPosition={{ x: 30, y: 60 }}
                />
            </div>
            <FloorLinks currentPath='/lectern' />
            <Guide />
        </>
    )
}

Lectern.auth = true
Lectern.scale = {
    sceneWidth: 1800,
    sceneHeight: 900,
}

export default Lectern
