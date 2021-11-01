import Script from 'next/script'
import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/client'

import { RecoilRoot, useSetRecoilState } from 'recoil'
import { smallDeviceState, scaleState, meState } from '../store/atom'

import Spin from '../components/minor/spin'

import { checkMobileDevice, getSceneScale } from '../libs/helper'

import '../styles/global.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <RecoilRoot>
        <Adapter scale={Component.scale}>
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </Adapter>
      </RecoilRoot>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=UA-47208480-12"
        onLoad={() => {
          window.dataLayer = window.dataLayer || []
          function gtag() {
            dataLayer.push(arguments)
          }
          gtag('js', new Date())
          gtag('config', 'UA-47208480-12', {
            page_path: window.location.pathname,
          })
        }}
      />
    </>
  )
}

function Adapter({ scale = { sceneWidth: 0, sceneHeight: 0 }, children }) {
  const setSmallDeviceState = useSetRecoilState(smallDeviceState)
  const setScaleState = useSetRecoilState(scaleState)

  const { sceneWidth, sceneHeight } = scale

  useEffect(() => {
    setSmallDeviceState(checkMobileDevice())
  }, [setSmallDeviceState])

  useEffect(() => {
    const isMobile = checkMobileDevice()
    if (!isMobile) {
      if (sceneWidth && sceneHeight) {
        setScaleState(getSceneScale(sceneWidth, sceneHeight))
      } else {
        setScaleState({
          className: 'scene-scale-100',
          value: 1,
        })
      }
    }
  }, [sceneWidth, sceneHeight])

  return children
}

function Auth({ children }) {
  const [developer, setDeveloper] = useState(null)
  const setMeState = useSetRecoilState(meState)
  const [session, loading] = useSession()

  useEffect(() => {
    if (process.env.NODE_ENV == 'development') {
      setDeveloper({
        name: `developer${new Date().getSeconds() % 9}`,
        image: `./avatar.png`,
      })
    }
  }, [])

  useEffect(() => {
    if (loading) {
      return // Do nothing while loading
    }

    if (developer) {
      setMeState(developer)
      return
    }

    if (!!session?.user) {
      setMeState((old) => {
        if (old.name === session.user.name) {
          return old
        }
        return session.user
      })
      return
    }

    signIn() // If not authenticated, force log in
  }, [loading, developer, session])

  if (!loading) {
    if (developer || !!session?.user) {
      return children
    }
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return (
    <div className="z-50 fixed top-0 left-0 right-0 bottom-0 bg-gray-100 z-50 flex justify-center items-center">
      <Spin />
      <span className="ml-2.5 text-base">loading...</span>
    </div>
  )
}
