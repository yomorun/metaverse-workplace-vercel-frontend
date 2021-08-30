const { RtcTokenBuilder } = require('agora-access-token')

const rtctoken = async (req, res) => {
    if (req.method === 'POST') {
        const { uid, channelName, role } = req.body
        if (uid && channelName && role) {
            const expirationTimeInSeconds = 24 * 60 * 60
            const currentTimestamp = Math.floor(Date.now() / 1000)
            const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

            try {
                const token = RtcTokenBuilder.buildTokenWithUid(
                    process.env.NEXT_PUBLIC_AGORA_APP_ID,
                    process.env.NEXT_AGORA_APP_CERTIFICATE,
                    channelName,
                    uid,
                    role,
                    privilegeExpiredTs
                )

                res.status(200).send({ token, privilegeExpiredTs, channelName })
            } catch (e) {
                res.status(500).json({ msg: e.message })
            }
        } else {
            res.status(400).json({ msg: 'Missing parameter: "uid", "channelName" and "role" is required.' })
        }
    } else {
        res.status(405).json({})
    }
}

export default rtctoken
