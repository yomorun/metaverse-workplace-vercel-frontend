import axios from 'axios'

axios.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    (response) => {
        return new Promise((resolve, reject) => {
            if (response.status === 200) {
                resolve(response.data)
            } else {
                reject(response)
            }
        })
    },
    (error) => {
        if (!error.response) {
            return Promise.reject(error)
        }

        if (error.response.status === 401) {

        }

        return Promise.reject(error)
    }
)

export default function request(config) {
    return axios({
        timeout: 10000,
        ...config
    })
}

export const getRtcToken = async (uid, channelName, role) => {
    const rtctoken = JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_RTCTOKENKEY))
    const currentTimestamp = Math.floor(Date.now() / 1000)
    if (
        rtctoken &&
        rtctoken.channelName === channelName &&
        currentTimestamp < rtctoken.privilegeExpiredTs
    ) {
        return Promise.resolve(rtctoken.token)
    } else {
        try {
            const response = await request({
                url: '/api/rtctoken',
                method: 'post',
                data: { uid, channelName, role }
            })

            localStorage.setItem(process.env.NEXT_PUBLIC_RTCTOKENKEY, JSON.stringify(response))
            return Promise.resolve(response.token)
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

export const fetchUser = async (login) => {
    return request({
        url: '/api/user',
        method: 'get',
        params: {
            login
        }
    })
}
