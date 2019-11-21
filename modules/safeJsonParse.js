const safeJsonParse = (json) => {
    let parsed 
    try {
      parsed = JSON.parse(json)
    } catch (e) {
      console.log("Couldn't parse JSON");
    }
    return parsed
}

module.exports = safeJsonParse;