const mongoose = require('mongoose');
const Band = require('../models/band');
const axios = require('axios');
const cheerio = require('cheerio');
const Scraper = require('./scraper');
const Promise = require('bluebird');
const dbConfig = require("../config/database.config");


mongoose.Promise = Promise;
mongoose.connect(dbConfig.mongoUrl, {
}, (err) => {
  if (err) {
    console.log(`DB CATCH: MongoDB Connection Error: ${err}`);
  }
});

const MA_URL =
'https://www.metal-archives.com/search/ajax-advanced/searching/bands/?country=FR&iDisplayStart=';
const startTime = Date.now();

const requestBands = index => new Promise((resolve, reject) => {
    axios.get(MA_URL + (index * 200).toString())
    .then(({ data }) => {
      const bands = data.aaData;
      return saveBands(bands);
    })
    .then((res) => {
      resolve(res);
    })
    .catch(err => reject(err));
  });

  requestBands.call()

const saveBands =  bands => new Promise((resolve, reject) => {
    const bandsToSave = [];
    bands.forEach((band) => {
      const $ = cheerio.load(band[0]);
      const aHref = $('a').attr('href');
        const bandID = parseInt(aHref.substr(aHref.lastIndexOf('/') + 1), 10);
      let bandPicture = ''; 
       Scraper.getBand(bandID)
      .then(result => {
        bandPicture = result.photoUrl
        if(result.photoUrl) {
          bandPicture = result.photoUrl
        }
        const bandObj = {
          band_name: $('a').text(),
          band_id: parseInt(aHref.substr(aHref.lastIndexOf('/') + 1), 10),
          band_genre: band[1],
          band_country: band[2],
          band_picture : bandPicture
        };
  
        Band.findOneAndUpdate({'band_id' : bandObj.band_id},bandObj, {upsert : true})
        .then(() => { 
            resolve()
        })
      })
      .catch(err => console.log(err))
      
      //bandsToSave.push(bandObj);
    });
    // Band.insertMany(bandsToSave, { ordered: false })
    //   .then((res) => { resolve(res.length); })
    //   .catch((err) => {
    //     if (err.code === 11000) {
    //       resolve(0);
    //     } else reject(err);
    //   });
    //   console.log('------------------');
    //   console.log(bandsToSave);
  });



