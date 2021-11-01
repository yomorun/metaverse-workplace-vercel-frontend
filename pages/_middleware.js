import { NextResponse } from 'next/server'

const countryRegion = require('../libs/amesh.json')

export async function middleware(req) {
  const { nextUrl: url, geo } = req
  const country = geo.country
  const mesh = getMeshID(country)

  url.searchParams.set('country', country)
  url.searchParams.set('region', mesh)

  return NextResponse.rewrite(url)
}

// 4 mesh nodes
function getMeshID(country) {
  if (country == undefined) {
    return 'us.x.yomo.dev'
  }

  if (country === 'CN') {
    return 'can.x.yomo.dev'
  }

  const res = countryRegion.find((item) => {
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
