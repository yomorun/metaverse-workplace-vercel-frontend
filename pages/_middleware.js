import {  NextResponse } from 'next/server'

export async function middleware(req) {
  const { nextUrl: url, geo } = req
  const country = geo.country || 'CN'
  const city = geo.city || 'Beijing'
  const region = geo.region || 'AS'


  url.searchParams.set('country', country)
  url.searchParams.set('city', city)
  url.searchParams.set('region', region)

  return NextResponse.rewrite(url)
}
