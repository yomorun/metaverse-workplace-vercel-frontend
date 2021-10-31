import Head from 'next/head'
import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('../components/scene'), { ssr: false })

export const getServerSideProps = ({ query }) => {
  return {
    props: query,
  }
}

export default function Floor2({ city, country, region }) {
  return (
    <>
      <Head>
        <title>Live Meeting Floor</title>
      </Head>
      <div className="w-screen h-screen flex justify-center items-center bg-black">
        <Scene
          zone={{ city, country, region }}
          className="w-1600px min-w-1600px h-1000px mobile-bg-1"
          width={1600}
          height={1000}
          floor="floor2"
          backgroundImage="/bg-floor-2.png"
          playerInitialPosition={{ x: 200, y: 800 }}
          boundary={{ top: 40, left: 52, bottom: 1000 - 40, right: 1600 - 52 }}
          checkAreaList={[
            {
              id: 'area-1',
              position: {
                x: 130,
                y: 60,
              },
              rectangle: {
                width: 200,
                height: 200,
              },
              diameter: 80,
              iframeSrc: 'https://hijiangtao.js.org/',
            },
            {
              id: 'area-2',
              position: {
                x: 500,
                y: 130,
              },
              rectangle: {
                width: 600,
                height: 180,
              },
              imgList: [
                {
                  id: 1,
                  src: 'http://rte-conference.oss-cn-beijing.aliyuncs.com/static/web/%E6%96%87%E5%AD%97%E4%BA%8C%E7%BA%A7%E5%BC%B9%E7%AA%97_%201.png',
                },
              ],
            },
            {
              id: 'area-3',
              position: {
                x: 680,
                y: 420,
              },
              circle: {
                diameter: 240,
              },
              imgList: [
                {
                  id: 1,
                  src: 'http://rte-conference.oss-cn-beijing.aliyuncs.com/static/web/%E6%96%87%E5%AD%97%E4%BA%8C%E7%BA%A7%E5%BC%B9%E7%AA%97_%203.png',
                },
              ],
            },
            // {
            //     id: 'area-4',
            //     position: {
            //         x: 1250,
            //         y: 90
            //     },
            //     rectangle: {
            //         width: 200,
            //         height: 200
            //     },
            //     // imgList: [

            //     // ]
            // },
            {
              id: 'area-5',
              position: {
                x: 1200,
                y: 680,
              },
              rectangle: {
                width: 300,
                height: 300,
              },
              nextPagePath: '/floor3',
            },
          ]}
        />
      </div>
    </>
  )
}
