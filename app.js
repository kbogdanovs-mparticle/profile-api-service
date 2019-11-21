const express = require('express');
const app = express();
const port = 3000;
global.cache = {};

const getToken = require('./modules/getToken');
const getProfile = require('./modules/getProfile');
const safeJsonParse = require('./modules/safeJsonParse');

app.get('/user/:mpid', async (req, res) => {
    const mpid = req.params.mpid;
    const token = await getToken().catch((err) => {
        console.log(err);
        return null;
    });
    const profile = await getProfile(mpid, token).catch((err) => {
        console.log(err);
        return null;
    });

    //if we didn't find the profile, return a 404
    if (!profile) return res.sendStatus(404);
    
    const jsonProfile = safeJsonParse(profile);

    // if something else went wrong, return a 400
    if (!jsonProfile.id || jsonProfile.id != mpid) return res.sendStatus(400);       
    
    
    return res.json(jsonProfile);
});

app.listen(process.env.PORT || 3000, () => console.log(`Profile API Service listening on port ${port}!`))