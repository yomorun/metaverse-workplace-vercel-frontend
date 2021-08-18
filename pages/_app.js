import Script from 'next/script'
import { Provider } from '../context'
import '../styles/global.css'

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Provider>
                <Component {...pageProps} />
            </Provider>
            <Script
                src='https://www.googletagmanager.com/gtag/js?id=UA-47208480-12'
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
