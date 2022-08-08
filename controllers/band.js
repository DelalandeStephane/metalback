const Band = require("../models/band");

exports.getBands = ((req,res) => {
    Band.find(null,null,{limit:10}).then( bands => {
        res.status(201).json(bands)
    })
})