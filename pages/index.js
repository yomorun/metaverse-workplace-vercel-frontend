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

        Router.push('/floor1')
    }, [])

    return (
        <>
            <Head>
                <title>Open-source Virtual HQ with Geo-distributed System Tech Stacks</title>
            </Head>
        </>
    )
}
