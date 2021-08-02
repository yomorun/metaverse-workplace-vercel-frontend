import dynamic from 'next/dynamic'
import Head from 'next/head'
import Guide from '../components/guide'

const DynamicComponentWithNoSSR = dynamic(
    () => import('../components/container'),
    { ssr: false }
);

export default function Home() {
    return (
        <>
            <Head>
                <title>Open-source Virtual HQ with Geo-distributed System Tech Stacks</title>
            </Head>
            <DynamicComponentWithNoSSR />
            <Guide />
        </>
    );
}
