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
