/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'lh3.googleusercontent.com',
              port: '',
              //pathname: '/account123/**',
            },
          ],
        //domains:['lh3.googleusercontent.com']
    }
}

module.exports = nextConfig
