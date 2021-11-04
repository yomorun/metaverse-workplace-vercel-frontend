import { NextRequest, NextResponse } from 'next/server'
import countryRegion from '../libs/amesh.json'

export async function middleware(req: NextRequest) {
    const { nextUrl: url, geo } = req
    const country = geo.country
    const mesh = getMeshID(country)

    url.searchParams.set('country', country as string)
    url.searchParams.set('region', mesh)

    return NextResponse.rewrite(url)
}

// 4 mesh nodes
function getMeshID(country: string | undefined): string {
    if (country == undefined) {
        return 'us.x.yomo.dev'
    }

    if (country === 'CN') {
        return 'can.x.yomo.dev'
    }

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
            return 'sg.x.yomo.dev'
        case 'Europe':
            return 'de.x.yomo.dev'
        default:
            return 'us.x.yomo.dev'
    }
}
