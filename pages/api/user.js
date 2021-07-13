const moment = require('moment-timezone')
const jsc8 = require('jsc8')
const client = new jsc8({
    url: [process.env.C8URL],
    apiKey: process.env.C8APIKEY
})

export default async (req, res) => {
    if (req.method === 'POST') {
        const { login, accessToken, name, avatar } = req.body
        if (login && accessToken) {
            const result = await client.executeQuery(`FOR u IN vhq FILTER u.login == '${login}' RETURN u`)
            const shanghai = moment().tz('Asia/Shanghai')
            if (result.length) {
                try {
                    await client.executeQuery(`UPDATE '${result[0]._key}' WITH { accessToken: '${accessToken}', updateAt: '${shanghai}' } IN vhq`)
                    res.status(200).json({ msg: 'success' })
                } catch (e) {
                    res.status(500).json({ msg: e.message })
                }
            } else {
                if (name && avatar) {
                    try {
                        await client.insertDocumentMany('vhq', [{ login, accessToken, name, avatar, createAt: shanghai, updateAt: shanghai }])
                        res.status(200).json({ msg: 'success' })
                    } catch (e) {
                        res.status(500).json({ msg: e.message })
                    }
                } else {
                    res.status(400).json({ msg: 'Missing parameter: "name" and "avatar" is required.' })
                }
            }
        } else {
            res.status(400).json({ msg: 'Missing parameter: "login" and "accessToken" is required.' })
        }
    } else {
        res.status(405).json({})
    }
}
