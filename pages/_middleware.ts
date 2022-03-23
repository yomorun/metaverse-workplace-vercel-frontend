import { NextRequest, NextResponse } from 'next/server'
import countryRegion from '../libs/amesh.json'

export async function middleware(req: NextRequest) {
    const { nextUrl: url, geo } = req
    const country = geo.country
    const argo = url.searchParams.get('argo') === 'true'
    const mesh = getMeshID(country, argo)

    url.searchParams.set('country', country ? country : 'US')
    url.searchParams.set('region', mesh)

    return NextResponse.rewrite(url)
}

// 4 mesh nodes
function getMeshID(country: string | undefined, argo: boolean): string {
    if (argo) {
        return 'argo-vhq.yomo.run'
    }

    if (country == undefined) {
        return 'us.x.yomo.dev'
    }

    //if (country === 'CN') {
    //    return 'cn1.x.yomo.dev'
    //}

    const res = countryRegion.find((item: { name: string; region: string }) => {
        if (item.name === country) {
            return item.region
        }
    })

    if (!res) {
        return 'us.x.yomo.dev'
    }

    switch (res.region) {
        case 'Asia':
            return 'kr.x.yomo.dev'
        case 'Europe':
            return 'fra.x.yomo.dev'
        default:
            return 'us.x.yomo.dev'
    }
}
