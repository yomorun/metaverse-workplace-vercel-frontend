
export const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

export class Logger {
    constructor(prefix, color) {
        this.prefix = prefix
        this.color = color
    }

    log(...msg) {
        console.log(`%c[${this.prefix}]`, this.color, ...msg)
        return this
    }
}

export const calcDistance = (element1, element2) => {
    if (element1 && element2) {
        const radius = element1.offsetWidth / 2

        const { left, top } = element1.getBoundingClientRect()
        const x1 = left + radius
        const y1 = top + radius

        {
            const { left, top } = element2.getBoundingClientRect()
            const x2 = left + radius
            const y2 = top + radius

            const distance = (Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) - radius * 2) << 0

            return distance > 0 ? distance : 0
        }
    }

    return 0
}

export const checkCircularCollisionByDom = (element1, element2) => {
    if (element1 && element2) {
        const r1 = element1.offsetWidth / 2
        const r2 = element2.offsetWidth / 2

        const { left, top } = element1.getBoundingClientRect()
        const x1 = left + r1
        const y1 = top + r1

        {
            const { left, top } = element2.getBoundingClientRect()
            const x2 = left + r2
            const y2 = top + r2

            const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))

            const bodyDistance = distance - r1 - r2

            return {
                distance,
                bodyDistance,
                collided: bodyDistance < 0,
            }
        }
    }

    return {
        distance: 0,
        collided: false
    }
}

export const checkCircularCollision = (x1, y1, r1, x2, y2, r2) => {
    const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    return {
        distance,
        collided: distance < r1 + r2,
    }
}

export const checkMobileDevice = () => {
    return !!window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
}


export const getViewportSize = () => {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }
}

export const getQueryString = name => {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    const r = window.location.search.slice(1).match(reg)
    if (r != null) {
        return decodeURI(r[2])
    }
    return null
}


export const getScale = (baseWidth, baseHeight) => {
    const scaleList = [
        {
            className: 'ym-scale-200',
            value: 2
        },
        {
            className: 'ym-scale-190',
            value: 1.9
        },
        {
            className: 'ym-scale-180',
            value: 1.8
        },
        {
            className: 'ym-scale-170',
            value: 1.7
        },
        {
            className: 'ym-scale-160',
            value: 1.6
        },
        {
            className: 'ym-scale-150',
            value: 1.5
        },
        {
            className: 'ym-scale-140',
            value: 1.4
        },
        {
            className: 'ym-scale-130',
            value: 1.3
        },
        {
            className: 'ym-scale-120',
            value: 1.2
        },
        {
            className: 'ym-scale-110',
            value: 1.1
        },
        {
            className: 'ym-scale-105',
            value: 1.05
        },
        {
            className: 'ym-scale-100',
            value: 1
        },
        {
            className: 'ym-scale-95',
            value: 0.95
        },
        {
            className: 'ym-scale-90',
            value: 0.9
        },
        {
            className: 'ym-scale-85',
            value: 0.85
        },
        {
            className: 'ym-scale-80',
            value: 0.8
        },
        {
            className: 'ym-scale-75',
            value: 0.75
        },
        {
            className: 'ym-scale-70',
            value: 0.7
        },
        {
            className: 'ym-scale-65',
            value: 0.65
        },
        {
            className: 'ym-scale-60',
            value: 0.6
        },
        {
            className: 'ym-scale-50',
            value: 0.5
        }
    ]

    const { width, height } = getViewportSize()

    const isSafari = (navigator.userAgent.indexOf('Chrome') <= 0 && navigator.userAgent.indexOf('Safari') >= 0)

    const bar = isSafari ? 60 : 0

    for (let i = 0; i < scaleList.length; i++) {
        const item = scaleList[i]
        if (item.value * baseHeight < height - bar - 20 && item.value * baseWidth < width) {
            return item
        }
    }

    return {
        className: 'ym-scale-100',
        value: 1
    }
}

export const stringToColor = str => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = '#'
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF
        color += ('00' + value.toString(16)).slice(-2)
    }
    return color
}

export const isDuringDate = (beginStr, endStr) => {
    if (!beginStr || !endStr) {
        return true
    }

    const curDate = new Date()
    const beginDate = new Date(beginStr)
    const endDate = new Date(endStr)
    return curDate >= beginDate && curDate <= endDate
}
