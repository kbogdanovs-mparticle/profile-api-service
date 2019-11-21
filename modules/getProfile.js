const request = require('request');

const orgId = process.env.ORG_ID
const accountId = process.env.ACCOUNT_ID
const workspaceId = process.env.WORKSPACE_ID


const getProfile = async (mpid, token) => {
    return new Promise((resolve, reject) => {
        
        const options = { 
            method: 'GET',
            url: `https://api.mparticle.com/userprofile/v1/${orgId}/${accountId}/${workspaceId}/${mpid}?fields=device_identities,user_identities,user_attributes,audience_memberships,attribution`,
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        };

        request(options, (error, response, body) => {
        if (error) {
            console.log(error);
            reject(new Error('Request Failed'));
        }
        if (response.statusCode === 200) {
            resolve(body);
        }
        reject (new Error('Something Went Wrong'));
        })
    });;
};

module.exports = getProfile;



