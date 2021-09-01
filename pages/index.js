import { useEffect } from 'react'
import Head from 'next/head'
import Router from 'next/router'

export default function Home() {
    useEffect(() => {
        const accessToken = localStorage.getItem(process.env.NEXT_PUBLIC_ACCESSTOKENKEY)
        if (!accessToken) {
            Router.push('/login')
            return
        }

        const rtctoken = JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_RTCTOKENKEY))
        const path = rtctoken && rtctoken.channelName ? `/${rtctoken.channelName}` : '/floor1'
        Router.push(path)
    }, [])

    return (
        <>
            <Head>
                <title>Open-source Virtual HQ with Geo-distributed System Tech Stacks</title>
            </Head>
        </>
    )
}
