import Script from 'next/script'

const GA = () => {
    return (
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
    )
}

export default GA
