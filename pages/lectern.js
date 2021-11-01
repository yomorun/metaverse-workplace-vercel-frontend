import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import Sidebar from '../components/minor/sidebar'
import FloorLinks from '../components/minor/floor-links'
import Guide from '../components/minor/guide'
import { useSetRecoilState } from 'recoil'
import { locationState } from '../store/atom'

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

export default function Lectern({ query: { city, country, region } }) {
    const setLocationState = useSetRecoilState(locationState)

    useEffect(() => {
        setLocationState({ city, country, region })
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
                    width={1800}
                    height={900}
                    floor='lectern'
                    backgroundImage='/bg-lectern.png'
                    boundary={{
                        top: 20,
                        left: 20,
                        bottom: 900 - 20,
                        right: 1800 - 20,
                    }}
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
    sceneHeight: 900
}
