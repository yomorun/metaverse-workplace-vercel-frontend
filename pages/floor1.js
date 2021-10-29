import Head from 'next/head'
import dynamic from 'next/dynamic'

const Scene = dynamic(
    () => import('../components/scene'),
    {ssr: false}
)

export const getServerSideProps = ({ query }) => {
    return {
    props: query,
  }}

export default function Floor1({city,country,region}) {
    return (
        <>
            <Head>
                <title>Open-source Virtual HQ with Geo-distributed System Tech Stacks</title>
            </Head>
            <div className='w-screen h-screen flex justify-center items-center bg-black'>
                <Scene zone={{city,country,region}}
                    className='w-1800px min-w-1800px h-900px mobile-bg-1'
                    width={1800}
                    height={900}
                    floor='floor1'
                    backgroundImage='/bg-floor-1.png'
                    boundary={{top: 5, left: 5, bottom: 900 - 5, right: 1800 - 5}}
                    checkAreaList={[
                        {
                            id: 'area-1',
                            position: {
                                x: 10,
                                y: 550
                            },
                            rectangle: {
                                width: 250,
                                height: 340
                            },
                            imgList: [
                                {
                                    id: 1,
                                    startAt: '10/21/2021 01:00:00',
                                    endAt: '10/23/2021 23:59:00',
                                    src: 'https://rte-conference.oss-accelerate.aliyuncs.com/static/web/%E5%B1%95%E5%95%86%E5%90%8D%E5%BD%95.png'
                                },
                            ]
                        },
                        {
                            id: 'area-2',
                            position: {
                                x: 400,
                                y: 500
                            },
                            rectangle: {
                                width: 340,
                                height: 100
                            },
                            imgList: [
                                {
                                    id: 1,
                                    startAt: '10/21/2021 01:00:00',
                                    endAt: '10/22/2021 12:00:00',
                                    src: 'https://rte-conference.oss-accelerate.aliyuncs.com/static/web/%E5%AE%9E%E6%97%B6%E4%B8%87%E8%B1%A1%E9%A2%91%E9%81%93%C2%B7%E4%B8%BB%E8%AE%BA%E5%9D%9B.jpg'
                                },
                                {
                                    id: 2,
                                    startAt: '10/22/2021 12:00:10',
                                    endAt: '10/22/2021 23:59:00',
                                    src: 'https://rte-conference.oss-accelerate.aliyuncs.com/static/web/IoT%E5%88%86%E8%AE%BA%E5%9D%9B_.jpg'
                                },
                                {
                                    id: 3,
                                    startAt: '10/23/2021 01:00:00',
                                    endAt: '10/23/2021 23:59:00',
                                    src: 'https://rte-conference.oss-accelerate.aliyuncs.com/static/web/%E8%A7%86%E9%A2%91%E6%8A%80%E6%9C%AF%E4%B8%93%E5%9C%BA.jpg'
                                },
                            ]
                        },
                        {
                            id: 'area-3',
                            position: {
                                x: 400,
                                y: 650
                            },
                            rectangle: {
                                width: 340,
                                height: 100
                            },
                            imgList: [
                                {
                                    id: 1,
                                    startAt: '10/21/2021 01:00:00',
                                    endAt: '10/22/2021 12:00:00',
                                    src: 'https://rte-conference.oss-accelerate.aliyuncs.com/static/web/%E5%AE%9E%E6%97%B6%E4%B8%87%E8%B1%A1%E9%A2%91%E9%81%93%C2%B7%E4%B8%BB%E8%AE%BA%E5%9D%9B.jpg'
                                },
                                {
                                    id: 2,
                                    startAt: '10/22/2021 12:00:10',
                                    endAt: '10/22/2021 23:59:00',
                                    src: 'https://rte-conference.oss-accelerate.aliyuncs.com/static/web/Product%20channel.jpg'
                                },
                                {
                                    id: 3,
                                    startAt: '10/23/2021 01:00:00',
                                    endAt: '10/23/2021 12:00:00',
                                    src: 'https://rte-conference.oss-accelerate.aliyuncs.com/static/web/RTE%E5%88%9B%E6%96%B0%E5%A4%A7%E8%B5%9B%E5%86%B3%E8%B5%9B.jpg'
                                },
                                {
                                    id: 4,
                                    startAt: '10/23/2021 12:00:10',
                                    endAt: '10/23/2021 23:59:00',
                                    src: 'https://rte-conference.oss-accelerate.aliyuncs.com/static/web/%E5%AE%9E%E6%97%B6%E4%BA%92%E5%8A%A8%E5%9C%BA%E6%99%AF%E5%88%9B%E6%96%B0%E5%88%9B%E4%B8%9A%E8%AE%BA%E5%9D%9B.jpg'
                                },
                            ]
                        },
                        {
                            id: 'area-4',
                            position: {
                                x: 400,
                                y: 800
                            },
                            rectangle: {
                                width: 340,
                                height: 90
                            },
                            imgList: [
                                {
                                    id: 1,
                                    startAt: '10/21/2021 01:00:00',
                                    endAt: '10/22/2021 12:00:00',
                                    src: 'https://rte-conference.oss-accelerate.aliyuncs.com/static/web/%E5%AE%9E%E6%97%B6%E4%B8%87%E8%B1%A1%E9%A2%91%E9%81%93%C2%B7%E4%B8%BB%E8%AE%BA%E5%9D%9B.jpg'
                                },
                                {
                                    id: 2,
                                    startAt: '10/22/2021 12:00:10',
                                    endAt: '10/22/2021 23:59:00',
                                    src: 'https://rte-conference.oss-accelerate.aliyuncs.com/static/web/%E9%9F%B3%E9%A2%91%E6%8A%80%E6%9C%AF%E4%B8%93%E5%9C%BA.jpg'
                                },
                                {
                                    id: 3,
                                    startAt: '10/23/2021 01:00:00',
                                    endAt: '10/23/2021 12:00:00',
                                    src: 'https://rte-conference.oss-accelerate.aliyuncs.com/static/web/%E7%BD%91%E8%B7%AF%E4%BC%A0%E8%BE%93%E4%B8%8E%E6%9E%B6%E6%9E%84%E4%B8%93%E5%9C%BA.jpg'
                                },
                                {
                                    id: 4,
                                    startAt: '10/23/2021 12:00:10',
                                    endAt: '10/23/2021 23:59:00',
                                    src: 'https://rte-conference.oss-accelerate.aliyuncs.com/static/web/%E7%A4%BE%E4%BA%A4%E6%B3%9B%E5%A8%B1%E4%B9%90%E5%8F%8A%E5%87%BA%E6%B5%B7%E5%88%86%E8%AE%BA%E5%9D%9B.jpg'
                                },
                            ]
                        },
                        {
                            id: 'area-5',
                            position: {
                                x: 920,
                                y: 0
                            },
                            rectangle: {
                                width: 450,
                                height: 120
                            },
                            imgList: [
                                {
                                    id: 1,
                                    startAt: '10/21/2021 01:00:00',
                                    endAt: '10/22/2021 23:59:00',
                                    src: 'https://rte-conference.oss-accelerate.aliyuncs.com/static/web/%E5%A4%A7%E5%89%8D%E7%AB%AF%E4%B8%8E%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E4%B8%93%E5%9C%BA.jpg'
                                },
                                {
                                    id: 2,
                                    startAt: '10/23/2021 01:00:00',
                                    endAt: '10/23/2021 12:00:00',
                                    src: 'https://rte-conference.oss-accelerate.aliyuncs.com/static/web/%E6%95%99%E8%82%B2%E5%88%86%E8%AE%BA%E5%9D%9B_.jpg'
                                },
                                {
                                    id: 3,
                                    startAt: '10/23/2021 12:00:10',
                                    endAt: '10/23/2021 23:59:00',
                                    src: 'https://rte-conference.oss-accelerate.aliyuncs.com/static/web/AI%20%E6%8A%80%E6%9C%AF%E5%BA%94%E7%94%A8%E4%B8%93%E5%9C%BA.jpg'
                                },
                            ]
                        },
                        // {
                        //     id: 'area-6',
                        //     position: {
                        //         x: 1000,
                        //         y: 270
                        //     },
                        //     rectangle: {
                        //         width: 460,
                        //         height: 120
                        //     },
                        //     // imgList: [

                        //     // ]
                        // },
                        {
                            id: 'area-7',
                            position: {
                                x: 1560,
                                y: 0
                            },
                            rectangle: {
                                width: 240,
                                height: 200
                            },
                            imgList: [
                                {
                                    id: 1,
                                    startAt: '10/21/2021 01:00:00',
                                    endAt: '10/23/2021 23:59:00',
                                    src: 'https://rte-conference.oss-accelerate.aliyuncs.com/static/web/%E4%B8%AA%E4%BA%BA%E4%BF%A1%E6%81%AF%E4%BF%9D%E6%8A%A4.jpg'
                                },
                            ]
                        },
                    ]}
                />
            </div>
        </>
    )
}
