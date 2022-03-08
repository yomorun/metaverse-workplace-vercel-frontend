import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

export default NextAuth({
    providers: [
        // https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/github.js
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            profile(profile: any) {
                return {
                    id: profile.id.toString(),
                    name: profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                }
            },
        }),
    ],
    theme: {
        colorScheme: 'light',
    },
})
