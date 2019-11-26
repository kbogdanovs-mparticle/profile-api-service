const request = require('request');

const orgId = process.env.ORG_ID;
const accountId = process.env.ACCOUNT_ID;
const workspaceId = process.env.WORKSPACE_ID;
const getToken = require('./getToken');
const safeJsonParse = require('./safeJsonParse');

const getProfile = async (req, res, next) => {
    const token = await getToken();
    const mpid = req.params.mpid;    
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
            return next();
        }
        if (response.statusCode === 200) {
            req.profile = safeJsonParse(body);
            return next();
        }
        next();
    });
};
module.exports = getProfile;



