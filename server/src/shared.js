module.exports = {
    getReqQueryFields: function (req) {
        if (req.query.fields === undefined) {
            console.log("req.query.fields is undefined")
            return;
        }
        const fieldsToRetrieve = req.query.fields.replace(",", " ")
        const isOnlyLetters = /^[a-zA-Z ]+$/.test(fieldsToRetrieve)
        if (!isOnlyLetters) {
            console.error("req.query.fields is not just english letters! That's not save")
            throw "Bad Request"
        }
        return fieldsToRetrieve
    }
}