const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// 클럽 스키마 정의
const clubSchema = new mongoose.Schema({
  clubName: String,
  clubImage: String,
  clubSite: String
});

// 클럽 모델 생성
const Club = mongoose.model('Club', clubSchema);

const saveClub = async (clubName, clubImage, clubSite) => {
  try {
    const club = new Club({
      clubName,
      clubImage,
      clubSite
    });

    await club.save();
    console.log(`Saved club: ${clubName}`);
  } catch (error) {
    console.log(`Error saving club: ${error}`);
  }
};

const scrapeClubs = async () => {
  try {
    // 웹 페이지에서 HTML 가져오기
    const response = await axios.get('https://www.mlssoccer.com/clubs/');
    if (response.status === 200) {
      const html = response.data;

      // Cheerio를 사용하여 HTML 파싱
      const $ = cheerio.load(html);

      // 각 클럽의 요소를 반복하면서 데이터 추출
      let counter = 1;
      let selector = `#main-content > section > div > div:nth-child(${counter}) > div.mls-o-clubs-hub-clubs-list__club-logo > picture > img`;
      let element = $(selector);

      while (element.length > 0) {
        const clubName = element.attr('alt');
        const clubImage = element.attr('src');

        let clubSite = '';
        const clubSiteSelector = `#main-content > section > div > div:nth-child(${counter}) > div.mls-o-clubs-hub-clubs-list__club-info > div.mls-o-clubs-hub-clubs-list__club-links > a:nth-child(5)`;
        const clubSiteElement = $(clubSiteSelector);
        if (clubSiteElement.length > 0) {
          clubSite = clubSiteElement.attr('href');
        }

        await saveClub(clubName, clubImage, clubSite);

        counter++;
        selector = `#main-content > section > div > div:nth-child(${counter}) > div.mls-o-clubs-hub-clubs-list__club-logo > picture > img`;
        element = $(selector);
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    mongoose.disconnect();
  }
};

(async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/taemin_final', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    await scrapeClubs();
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();
