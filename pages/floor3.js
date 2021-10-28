import Head from 'next/head'
import dynamic from 'next/dynamic'

const Scene = dynamic(
    () => import('../components/scene'),
    { ssr: false }
)

export default function Floor3() {
    return (
        <>
            <Head>
                <title>Live Meeting Floor</title>
            </Head>
            <div className='w-screen h-screen flex justify-center items-center bg-black'>
                <Scene
                    className='w-1800px min-w-1800px h-900px mobile-bg-2'
                    width={1800}
                    height={900}
                    floor='floor3'
                    backgroundImage='/bg-floor-3.png'
                    boundary={{
                        top: 20,
                        left: 20,
                        bottom: 900 - 20,
                        right: 1800 - 20,
                        lectern: {
                            left: 1090,
                            bottom: 700,
                        }
                    }}
                />
            </div>
        </>
    )
}
