const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
global.cache = {};

const getProfile = require('./modules/getProfile');
const productRecs = require('./modules/productRecs');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Don't use for production! Returns full profile
app.get('/users/:mpid/full-profile', getProfile, (req, res) => {
    const profile = req.profile || null;
    if (!profile) return res.sendStatus(400);
    return res.json(profile);
});

// Return product recs for a carousel
app.get('/users/:mpid/product-recs', getProfile, (req, res) => {
    const profile = req.profile || {};
    const attributes = profile.user_attributes || null;
    if (!attributes) return res.json({"products": productRecs.defaultProducts()});

    // If we have ML recommendations, just return them
    if (attributes.ml_product_recs) {
        const products = productRecs.findByIds(attributes.ml_product_recs);
        return res.json({"products": products});
    }
    // Select recs based on the category of the last purchase
    if (attributes.last_purchase_category) {
        const products = productRecs.findByCategory(attributes.last_purchase_category)
        return res.json({"products": products});
    }
    
    // Select recs based on purchased third-party demo data
    if (attributes.tp_gender || attributes.tp_age) {
        const products = productRecs.findByDemo({
            gender: attributes.tp_gender || null,
            age: attributes.tp_age || null
        });
        return res.json({"products": products});
    }
    
    // If we have nothing, return a default set
    return res.json({"products": productRecs.defaultProducts()});
});

// Return churn risk score
app.get('/users/:mpid/churn-risk', getProfile, (req, res) => {
    const profile = req.profile || {};
    const attributes = profile.user_attributes || {};
    return res.json({
        churn_risk_score: attributes.churn_risk_score || 0,
        ltv: attributes.lifetime_value || 0
    });
});


app.listen(port, () => console.log(`Profile API Service listening on port ${port}!`))