const router = require('express').Router()
require('dotenv').config()
const NewsSchema = require('../model/news-model')
const LinkSchema = require('../model/link-model')
const request = require('request')
const findNews = require('../util/news-finder')
let newsList = []

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  // Return array of year and week number
  return weekNo;
}

function routes(){
  router.post("/check_next/:id", async (req, res) => {
    let body = req.body;
    let scrapedWeek = 0;
    let currentWeek = 1;
    let allLinks = await LinkSchema.find()
    let link = allLinks[0].news_link;
    console.log(body)

    var j = request.jar();
    var options = {
      'method': 'GET',
      'url': link,
      // 'headers': {
      //   'Cookie': '__cf_bm=5e5fedadc6d27d405981d01ed4ab86d6c4cd4233-1616756203-1800-AduzS7UeRqRPuf83BJSaZIb7a6lD5wjqq3CZsLfWSToBq7SmMN0btAiQH2lg/lNZRSSWaaErYW4CtSgJwS3AZrhjRT1AAOyomsPJsGuFoE1z; __cfduid=d2355527c7208b4ae95c15272e0d2e9021615813212'
      // }
    };
    
    let scrapedNews = await NewsSchema.find()
    //console.log(scrapedNews)
    if(scrapedNews.length>0){
      //scrapedWeek = await getWeekNumber(new Date(scrapedNews[0].last_check))
      //currentWeek = await getWeekNumber(new Date())
      let time_diff = Math.abs(new Date() - new Date(scrapedNews[0].last_check)) / 36e5;
      //console.log(time_diff)
      if(time_diff>48){
        scrapedNews = []
      }
    }

    if(scrapedNews.length > 0){
      let sendNews = JSON.parse(JSON.stringify(scrapedNews[0].all_news))
        let newsResults = await findNews(sendNews,req.params.id)
        console.log(newsResults);
        res.status(200).json({
          time: newsResults[0],
          name: newsResults[1]
        })

    } else if (scrapedNews.length === 0) {
      request(options, async (error, response) => {
        if (error) throw new Error(error);
        newsList=JSON.parse(response.body);
        await NewsSchema.deleteMany({
          fier: 1
        })
        const news = new NewsSchema({
          last_check: new Date(),
          all_news: newsList,
          fier: 1
        })

        await news.save()
        let newsResults = await findNews(newsList,req.params.id)

        res.status(201).json({
          time: newsResults[0],
          name: newsResults[1]
        })
      });
    }
  
    try {
      NewsSchema()
    } catch(error) {
      res.status(500).json({ success: false, error: error.message })
    }
  })

  router.post("/add", async (req, res) => {
    let body = req.body;
    let allLinks = await LinkSchema.find()
    let link = allLinks[0].news_link;
    let jsonData = []

    var j = request.jar();
    var options = {
      'method': 'GET',
      'url': link,
      // 'headers': {
      //   'Cookie': '__cf_bm=5e5fedadc6d27d405981d01ed4ab86d6c4cd4233-1616756203-1800-AduzS7UeRqRPuf83BJSaZIb7a6lD5wjqq3CZsLfWSToBq7SmMN0btAiQH2lg/lNZRSSWaaErYW4CtSgJwS3AZrhjRT1AAOyomsPJsGuFoE1z; __cfduid=d2355527c7208b4ae95c15272e0d2e9021615813212'
      // }
    };
    
    try {
      request(options, async (error, response) => {
        if (error) throw new Error(error);
        jsonData=JSON.parse(response.body);
        newsList=JSON.parse(response.body);
        await NewsSchema.deleteMany({
          fier: 1
        })
        const news = new NewsSchema({
          last_check: new Date(),
          all_news: newsList,
          fier: 1
        })
  
        const saved = await news.save()
  
        res.status(201).json({
          success: false,
          news: saved
        })
      });
      
    } catch(error) {
      res.status(500).json({ success: false, error: error.message })
    }
  })

  router.post("/", async (req, res) => {
    let body = req.body;
  
    try {
      const newLink = new LinkSchema({
        news_link: body.link,
        last_update: new Date()
      })

      const saved = await newLink.save()

      res.status(201).json({
        success: true,
        response: saved
      })
    } catch(error) {
      res.status(500).json({ success: false, error: error.message })
    }
  })
  
  return router;
};

module.exports = routes