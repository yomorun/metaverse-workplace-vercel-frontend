import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
    // https://next-auth.js.org/configuration/providers
    providers: [
        // https://github.com/nextauthjs/next-auth/blob/main/src/providers/github.js
        Providers.GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            profile(profile) {
                // You can use the tokens, in case you want to fetch more profile information
                // For example several OAuth providers do not return email by default.
                // Depending on your provider, will have tokens like `access_token`, `id_token` and or `refresh_token`
                return {
                    id: profile.id,
                    name: profile.login,
                    email: profile.email,
                    image: profile.avatar_url
                }
            },
        }),
    ],
    theme: 'light',
})
