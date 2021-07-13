import React, { useEffect, useState } from 'react'
import Router from 'next/router'
import axios from 'axios'
import Spin from '../components/spin'

import styles from '../styles/login.module.css'

function getQueryString(name) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    const r = window.location.search.substr(1).match(reg)
    if (r != null) {
        return unescape(r[2])
    }
    return null
}

export default function Login() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const code = getQueryString('code')

        if(!code){
            setLoading(false)
            return null
        }

        axios({
            url: `${process.env.NEXT_PUBLIC_SITEURL}/api/login`,
            method: 'get',
            params: {
                code
            }
        }).then(tokenRes => {
            if (tokenRes.status === 200) {
                const accessToken = tokenRes.data.access_token
                axios({
                    url: 'https://api.github.com/user',
                    method: 'get',
                    headers: {
                        'accept': 'application/vnd.github.v3+json',
                        'Authorization': `token ${accessToken}`
                    },
                }).then(userRes => {
                    if (userRes.status === 200) {
                        axios({
                            url: `${process.env.NEXT_PUBLIC_SITEURL}/api/user`,
                            method: 'post',
                            data: {
                                accessToken,
                                login: userRes.data.login,
                                name: userRes.data.name,
                                avatar: userRes.data.avatar_url
                            }
                        }).then(res => {
                            if (res.status === 200) {
                                const user = {
                                    login: userRes.data.login,
                                    name: userRes.data.name,
                                    avatar: userRes.data.avatar_url,
                                }
                                localStorage.setItem(process.env.NEXT_PUBLIC_ACCESSTOKENKEY, accessToken)
                                localStorage.setItem(process.env.NEXT_PUBLIC_USERKEY, JSON.stringify(user))
                                Router.push('/')
                            }
                        }).catch(() => {

                        })
                    }
                }).catch(() => {

                })
            }
        }).catch(() => {

        })
        
    }, [])

    return (
        <>
            {
                loading
                    ? (
                        <div className={styles.loadingBox}>
                            <Spin />
                            <span>loading...</span>
                        </div>
                    )
                    : (
                        <div className={styles.main}>
                            <a
                                className={styles.button}
                                role='button'
                                href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_SITEURL}/login`}
                            >
                                Login with GitHub
                            </a>
                        </div>
                    )
            }
        </>
    )
}