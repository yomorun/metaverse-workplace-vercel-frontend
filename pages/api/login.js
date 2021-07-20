const axios = require('axios')
const jsc8 = require('jsc8')
const client = new jsc8({
    url: [process.env.C8URL],
    apiKey: process.env.C8APIKEY
})

const login = async (req, res) => {
    if (req.method === 'GET') {
        const { code } = req.query
        if (code) {
            try {
                const response = await axios({
                    url: `https://github.com/login/oauth/access_token?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`,
                    method: 'post',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
                        'Accept': 'application/json'
                    },
                })

                res.status(200).send(response.data)
            } catch (error) {
                res.status(401).send({
                    error_description: 'The authorization method is invalid, or the login callback address is invalid, expired, or has been revoked.'
                })
            }
        } else {
            res.status(400).json({ msg: 'Missing parameter: "code" is required.' })
        }
    } else {
        res.status(405).json({})
    }
}

export default login
