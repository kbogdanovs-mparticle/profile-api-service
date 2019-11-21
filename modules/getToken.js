const request = require('request');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET

const getToken = () => {   
    return new Promise((resolve, reject) => {
        const cacheKey = clientId + '_token';
        const cachedToken = cache[cacheKey];
        // if cached token is not expired, use it
        if (cachedToken && cachedToken.expirationDate > Date.now()) {
            resolve(cachedToken.accessToken);
        }

        // otherwise, get a new one
        const options = { 
            method: 'POST',
            url: 'https://sso.auth.mparticle.com/oauth/token',
            body: { 
                client_id: clientId,
                client_secret: clientSecret,
                audience: 'https://api.mparticle.com',
                grant_type: 'client_credentials'
            },
            json: true 
        };

        request(options, (error, response, body) => {
        if (error) {
            console.log('Error getting access token for API v2.', error);
            reject(new Error(error));
        }
        cache[cacheKey] = {
            accessToken: body.access_token,
            // 60 seconds safe window time
            expirationDate: Date.now() + (body.expires_in - 60) * 1000
        };
        resolve(body.access_token);
        });
    })
};

module.exports = getToken;