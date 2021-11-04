export const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

export class Logger {
    public prefix: string
    public color: string

    constructor(prefix: string, color: string) {
        this.prefix = prefix
        this.color = color
    }

    log(...msg: any[]) {
        console.log(`%c[${this.prefix}]`, this.color, ...msg)
        return this
    }
}

export const calcDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

export const checkCircularCollision = (
    x1: number,
    y1: number,
    r1: number,
    x2: number,
    y2: number,
    r2: number
): boolean => {
    const distance = calcDistance(x1, y1, x2, y2)
    return distance < r1 + r2
}

export const checkMobileDevice = () => {
    return !!window.navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
}

export const getViewportSize = () => {
    return {
        width:
            window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height:
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight,
    }
}

export const getSceneScale = (
    sceneWidth: number,
    sceneHeight: number
): { className: string; value: number } => {
    const scaleList = [
        {
            className: 'scene-scale-120',
            value: 1.2,
        },
        {
            className: 'scene-scale-110',
            value: 1.1,
        },
        {
            className: 'scene-scale-105',
            value: 1.05,
        },
        {
            className: 'scene-scale-100',
            value: 1,
        },
        {
            className: 'scene-scale-95',
            value: 0.95,
        },
        {
            className: 'scene-scale-90',
            value: 0.9,
        },
        {
            className: 'scene-scale-85',
            value: 0.85,
        },
        {
            className: 'scene-scale-80',
            value: 0.8,
        },
        {
            className: 'scene-scale-75',
            value: 0.75,
        },
        {
            className: 'scene-scale-70',
            value: 0.7,
        },
        {
            className: 'scene-scale-65',
            value: 0.65,
        },
        {
            className: 'scene-scale-60',
            value: 0.6,
        },
        {
            className: 'scene-scale-50',
            value: 0.5,
        },
    ]

    const { width, height } = getViewportSize()

    const isSafari =
        navigator.userAgent.indexOf('Chrome') <= 0 && navigator.userAgent.indexOf('Safari') >= 0

    const bar = isSafari ? 60 : 0

    for (let i = 0; i < scaleList.length; i++) {
        const item = scaleList[i]
        if (item.value * sceneHeight < height - bar - 20 && item.value * sceneWidth < width) {
            return item
        }
    }

    return {
        className: 'scene-scale-100',
        value: 1,
    }
}
