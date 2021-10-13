import React, { useEffect, useState, useCallback } from 'react'
import Router from 'next/router'

import Spin from '../components/spin'
import Guide from '../components/guide'

import request, { fetchUser } from '../libs/request'
import { getQueryString, uuidv4 } from '../libs/lib'

function saveUserToLocal(login, avatar, role, accessToken) {
    localStorage.setItem(process.env.NEXT_PUBLIC_ACCESSTOKENKEY, accessToken)
    localStorage.setItem(process.env.NEXT_PUBLIC_USERKEY, JSON.stringify({ login, avatar, role }))
}

export default function Login() {
    const [loading, setLoading] = useState(true)
    const [isDev, setIsDev] = useState(false)

    useEffect(() => {
        if (process.env.NODE_ENV == 'development') {
            setIsDev(true)
        }

        const redirect = getQueryString('redirect')
        localStorage.setItem('FLOOR', redirect ? redirect : '')

        const code = getQueryString('code')

        if (!code) {
            setLoading(false)
            return null
        }

        async function processIO() {
            try {
                const tokenRes = await request({
                    url: `${process.env.NEXT_PUBLIC_SITEURL}/api/login`,
                    method: 'get',
                    params: {
                        code
                    }
                })

                const accessToken = tokenRes.access_token

                const githubUserRes = await request({
                    url: 'https://api.github.com/user',
                    method: 'get',
                    headers: {
                        'accept': 'application/vnd.github.v3+json',
                        'Authorization': `token ${accessToken}`
                    },
                })

                try {
                    const { data } = await fetchUser(githubUserRes.login)
                    saveUserToLocal(data.login, data.avatar, data.role, accessToken)
                    Router.push(`/${localStorage.getItem('FLOOR')}`)
                } catch (error) {
                    await request({
                        url: `${process.env.NEXT_PUBLIC_SITEURL}/api/user`,
                        method: 'post',
                        data: {
                            accessToken,
                            login: githubUserRes.login,
                            avatar: githubUserRes.avatar_url
                        }
                    })

                    saveUserToLocal(githubUserRes.login, githubUserRes.avatar_url, 'visitor', accessToken)
                    Router.push(`/${localStorage.getItem('FLOOR')}`)
                }
            } catch (error) {

            }
        }

        processIO()
    }, [])

    const handleAnonymousLogin = useCallback(e => {
        saveUserToLocal('visitor-' + uuidv4().slice(0, 8), './yomo.png', 'visitor', 'visitor')
        Router.push(`/${localStorage.getItem('FLOOR')}`)
    }, [])

    return (
        <>
            <div className='fixed top-0 left-0 w-screen h-screen bg-floor-1'></div>
            {
                loading
                    ? (
                        <div className='z-50 fixed top-0 left-0 right-0 bottom-0 bg-gray-100 z-50 flex justify-center items-center'>
                            <Spin />
                            <span className='ml-2.5 text-base'>loading...</span>
                        </div>
                    )
                    : isDev ? (
                        <div className='w-screen h-screen flex flex-col items-center justify-center'>
                            <div
                                className='z-50 px-4 py-2 rounded-lg bg-blue-900 text-xl text-white cursor-pointer hover:bg-blue-800'
                                onClick={handleAnonymousLogin}
                            >
                                Login
                            </div>
                        </div>
                    ) : (
                        <div className='w-screen h-screen flex flex-col items-center justify-center'>
                            <a
                                className='z-50 px-4 py-2 rounded-lg bg-blue-900 text-xl text-white no-underline hover:bg-blue-800'
                                role='button'
                                href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_SITEURL}/login`}
                            >
                                Login with GitHub
                            </a>
                            <br />
                            <div
                                className='z-50 px-4 py-2 rounded-lg bg-blue-900 text-xl text-white cursor-pointer hover:bg-blue-800'
                                onClick={handleAnonymousLogin}
                            >
                                Anonymous Login
                            </div>
                        </div>
                    )
            }
            <Guide />
        </>
    )
}
