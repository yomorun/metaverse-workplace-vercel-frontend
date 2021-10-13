const jsc8 = require('jsc8')
const client = new jsc8({
    url: [process.env.C8URL],
    apiKey: process.env.C8APIKEY
})

const user = async (req, res) => {
    if (req.method === 'GET') {
        const { login } = req.query
        if (login) {
            const result = await client.executeQuery(`FOR u IN vhq FILTER u.login == '${login}' RETURN u`)
            if (result.length) {
                res.status(200).json({ data: result[0], msg: 'success' })
            } else{
                res.status(200).json({ data: null, msg: 'success' })
            }
        } else {
            res.status(400).json({ msg: 'Missing parameter: "login" is required.' })
        }
    } else if (req.method === 'POST') {
        const { login, accessToken, avatar } = req.body
        if (login && accessToken) {
            const result = await client.executeQuery(`FOR u IN vhq FILTER u.login == '${login}' RETURN u`)
            if (result.length) {
                try {
                    await client.executeQuery(`UPDATE '${result[0]._key}' WITH { accessToken: '${accessToken}' } IN vhq`)
                    res.status(200).json({ msg: 'success' })
                } catch (e) {
                    res.status(500).json({ msg: e.message })
                }
            } else {
                try {
                    await client.insertDocumentMany('vhq', [{ login, accessToken, avatar }])
                    res.status(200).json({ msg: 'success' })
                } catch (e) {
                    res.status(500).json({ msg: e.message })
                }
            }
        } else {
            res.status(400).json({ msg: 'Missing parameter: "login" and "accessToken" is required.' })
        }
    } else {
        res.status(405).json({})
    }
}

export default user
