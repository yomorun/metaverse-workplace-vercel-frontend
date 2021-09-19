import Head from 'next/head'
import dynamic from 'next/dynamic'
import Floors from '../components/floors'
import Guide from '../components/guide'

const Scene = dynamic(
    () => import('../components/scene'),
    { ssr: false }
)

export default function Floor4() {
    return (
        <>
            <Head>
                <title>Open-source Virtual HQ with Geo-distributed System Tech Stacks</title>
            </Head>
            <img className='fixed top-0 left-0 w-screen h-screen' src='/floor4.png' alt='' />
            <Scene floor='floor4' />
            <Floors currentPath='floor4' />
            <Guide />
        </>
    )
}
