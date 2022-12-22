const Scraper = require("../helpers/scraper");
const Band = require("../models/band");

exports.getBands = ((req,res) => {
    Band.find(null,null,{sort:{band_name : 1}}).then( bands => {
        res.status(201).json(bands)
    })
})

exports.getBand = ((req,res) => {
    Scraper.getBand(req.params.id)
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => console.log(err))
})

exports.searchBands = ((req,res) => {
    const search = req.params.search;
    Band.find({ "band_name" : new RegExp("^"+search, 'i')},null,{skip: req.params.skip, sort:{band_name : 1}}).then( bands => {
        res.status(201).json(bands);
    })
})

exports.filterBands = ((req,res) => {
    let pipeline = [];
    if(req.body.letter){
        let regexp;
        if(req.body.letter === "special-caract"){
            regexp = new RegExp("^[^A-Za-z]", 'i');   
        }
        else {
            regexp = new RegExp("^"+ req.body.letter, 'i');
        }
        
        pipeline.push({$match: { band_name: regexp }  })
      }
    if(req.body.location){
        pipeline.push({$match: { band_country: new RegExp(req.body.location, 'i') }  })
      }
    if(req.body.genre){
        pipeline.push({$match: { band_genre :   new RegExp(req.body.genre, 'i') }  })
    }
    if(req.body.status){
        let value;
        if(req.body.status ==="actif"){
           value = new RegExp("active", 'i')
        }
        else if(req.body.status === "séparé / en pause") {
            value = new RegExp("[^active]", 'i')
        }
        pipeline.push({$match: { band_status :   value }  })
      }
      pipeline.push({$sort: { band_name :   1 }  })
      if(pipeline.length > 0 ){
        Band.aggregate(pipeline).then(bands => {
            res.status(201).json(bands)
          })
          .catch(error => {
            res.status(400).json(error);
          })
      } else {
        Band.find().then(bands => {
            res.status(201).json(bands)
          })
          .catch(error => {
            res.status(400).json(error);
          })
      }
    
})