
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

            return distance < r1 + r2
        }
    }

    return false
}

export const checkCircularCollision = (x1, y1, r1, x2, y2, r2) => {
    const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    return distance < r1 + r2
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
