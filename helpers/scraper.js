const cheerio = require('cheerio');
const axios = require('axios');
const GET_BAND_URL = 'https://www.metal-archives.com/bands/sieversiever/';

class Scraper {
    static getBand(bandID) {
        return new Promise((resolve, reject) => {
        axios.get(GET_BAND_URL + bandID.toString(), { timeout: 30000 }).then(({ data }) => {
            const $ = cheerio.load(data);
            const id = bandID;
            const name = $('.band_name a').text();
            const genre = $('#band_stats .float_right dt').nextAll().eq(0).text();
            const country = $('#band_stats .float_left dt').nextAll().eq(0).text();
            const location = $('#band_stats .float_left dt').nextAll().eq(2).text();
            const themes = $('#band_stats .float_right dt').nextAll().eq(2).text();
            const status = $('#band_stats .float_left dt').nextAll().eq(4).text();
            const label = $('#band_stats .float_right dt').nextAll().eq(4).text();
            const formYear = $('#band_stats .float_left dt').nextAll().eq(6).text();
            const yearsActive = $('#band_stats .float_right').nextAll().eq(0).children()
            .eq(1)
            .text()
            .replace(/\s/g, '');
            const photoUrl = $('#photo').attr('href');
            const logoUrl = $('#logo').attr('href');
            const band = {
            id,
            name,
            genre,
            country,
            location,
            themes,
            status,
            label,
            formYear,
            yearsActive,
            photoUrl,
            logoUrl,
            };
            resolve(band);
        }).catch(err => reject(err));
        });
    }
}

module.exports = Scraper;