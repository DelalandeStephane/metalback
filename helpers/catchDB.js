// Taken from metalarchives-api made by Amiralies 

const mongoose = require('mongoose');
const Band = require('../models/band');
const axios = require('axios');
const cheerio = require('cheerio');
const Scraper = require('./scraper');
const dbConfig = require("../config/database.config");
const MA_URL =
'https://www.metal-archives.com/search/ajax-advanced/searching/bands/?country=FR&iDisplayStart=';

mongoose
  .connect(dbConfig.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to the database");
  })
  .catch((err) => {
    console.log("The server cannot connect to the database "+err);
    process.exit();
  });

const getPaginationBandList = async () => {
    let bandPagination;
    await  axios.get(MA_URL)
    .then( ({ data }) =>  {
      const total = data.iTotalRecords;
      bandPagination = Math.ceil(total / 200);
    })
    return  bandPagination;
  };

  const requestBands = async () => {
    const paginationCount = await getPaginationBandList();
      // I don't know why but I have to add 2 at paginationCount to get the good numbers of bands, point to investigate
      for(let i = 0; i <= paginationCount+2 ; i++){
        await axios.get(MA_URL + (i * 200).toString(),{timeout : 30000}).then(({ data }) => {
            const bands = data.aaData;
            bands.forEach(band => {
              const $ = cheerio.load(band[0]);
              const aHref = $('a').attr('href');
              const bandID = parseInt(aHref.substr(aHref.lastIndexOf('/') + 1), 10);
              
              Scraper.getBand(bandID).then(result => {

                  const bandObj = {
                    band_name: $('a').text(),
                    band_id: parseInt(aHref.substr(aHref.lastIndexOf('/') + 1), 10),
                    band_genre: band[1],
                    band_country: band[2],
                    band_status : result.status
                  };
                  Band.findOneAndUpdate({'band_id' : bandObj.band_id},bandObj, {upsert : true})
                  .catch(err => console.log(err));
              })
            });
          })
        .catch(err => console.log(err));
      }
      console.log('------------------');
      console.log('upload ending');
      process.exit();
  }
  requestBands();