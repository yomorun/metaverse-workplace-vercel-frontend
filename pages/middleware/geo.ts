import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
    const { nextUrl: url, geo } = req
    const country = geo?.country

    url.searchParams.set('country', country ? country : 'US')
    url.searchParams.set('region', geo?.region ? geo.region : 'America')

    return NextResponse.rewrite(url)
}
