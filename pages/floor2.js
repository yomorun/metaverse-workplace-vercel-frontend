import Head from 'next/head'
import dynamic from 'next/dynamic'
import Floors from '../components/floors'
import Guide from '../components/guide'

const Scene = dynamic(
    () => import('../components/scene'),
    { ssr: false }
)

export default function Floor2() {
    return (
        <>
            <Head>
                <title>Open-source Virtual HQ with Geo-distributed System Tech Stacks</title>
            </Head>
            <div className='fixed top-0 left-0 w-screen h-screen bg-cover bg-no-repeat bg-center' style={{ backgroundImage: 'url(/floor2.png)' }}></div>
            <Scene floor='floor2' />
            <Floors currentPath='floor2' />
            <Guide />
        </>
    )
}
