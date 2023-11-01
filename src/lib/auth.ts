import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";
import { fetchRedis } from "@/helpers/redis";

function getGoogleCredentiels() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || clientId.length == 0) {
        throw new Error('Missing GOOGLE_CLIENT_ID');
    }

    if (!clientSecret || clientSecret.length == 0) {
        throw new Error('Missing GOOGLE_CLIENT_SECRET');
    }

    return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login'
    },
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentiels().clientId,
            clientSecret: getGoogleCredentiels().clientSecret
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            //  const dbUser = (await db.get(`user:${token.id}`)) as User | null;
            const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as
                | string
                | null;
            if (!dbUserResult) {
                if (user) {
                    token.id = user!.id;
                }

                return token;
            }

            const dbUser = JSON.parse(dbUserResult) as User;

            if (!dbUser) {
                token.id = user!.id;
                return token;
            }

            return {
                id: dbUser.id,
                email: dbUser.email,
                picture: dbUser.image,
                name: dbUser.name,
            }
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
            }

            return session;
        },
        redirect() {
            return '/dashboard'
        }
    }
}