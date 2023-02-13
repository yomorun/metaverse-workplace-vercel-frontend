import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render() {
        const clearbitURL = `https://grow.clearbitjs.com/api/pixel.js?v=${new Date().getTime()}`
        return (
            <Html lang='en'>
                <Head>
                    <meta
                        name='description'
                        content='Open-source Virtual HQ with YoMo and other Geo-distributed System Tech Stacks.'
                    />
                    <meta
                        name='twitter:image:src'
                        content='https://blog.yomo.run/static/images/logo.png'
                    />
                    <meta name='twitter:site' content='@yomohq' />
                    <meta name='twitter:card' content='summary_large_image' />
                    <meta name='twitter:title' content='YoMo Virtual HQ' />
                    <meta
                        name='twitter:description'
                        content='Open-source Virtual HQ with YoMo and other Geo-distributed System Tech Stacks.'
                    />
                    <meta charSet='utf-8' />
                    <meta name='googlebot' content='index,follow' />
                    <link rel='preconnect' href='https://fonts.googleapis.com' crossOrigin="anonymous" />
                    <link
                        rel='stylesheet'
                        media='print'
                        href='https://fonts.googleapis.com/css2?family=Exo+2:wght@400&amp;display=swap'
                    />
                    <script async src={clearbitURL}></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
