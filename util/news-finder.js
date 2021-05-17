const usdMatches = [
  "Federal Funds Rate & FOMC Statement",
  "Non-Farm Employment Change",
  "Unemployment Rate & Wages",
  "Advance GDP q/q",
  "FOMC Meeting Minutes"
];

const eurMatches = [
  "Main Refinancing Rate"
];

const gbpMatches = [
  "Official Bank Rates & MPC Votes",
  "CPI y/y"
];

const cadMatches = [
  "Overnight Rate / BOC Rate Statement",
  "CPI m/m",
  "Employment Change / Unemployment Rate"
];

const audMatches = [
  "Employment Change / Unemployment Rate",
  "Cash Rate & RBA Statement",
  "CPI q/q",
  "GDP q/q"
];

const nzdMatches = [
  "Employment Change & Unemployment Rate",
  "Official Cash Rate & RBNZ Rate Statement",
  "CPI q/q",
  "GDP q/q"
];

const chfMatches = [
  "SNB Policy Rate"
]

const daxMatches = [
  "German ZEW Economic Statement"
]

const crudeMatches = [
  "Crude Oil Inventories"
]

const ngasMatches = [
  "Natural Gas Storage"
]

const agMatches = [
  "Crop Production"
]


/* usd eur gbp cad aud nzd chf dax crude ngas ag*/

function newsFinder(newsSet, symbol){
  let matches = []
  if(symbol === 'crude'){
    for(let i=0; i<crudeMatches.length; i++){
      matches.push(findMatches(crudeMatches[i], newsSet, symbol))
    }
  }
  if(symbol === 'dax'){
    for(let i=0; i<daxMatches.length; i++){
      matches.push(findMatches(daxMatches[i], newsSet, symbol))
    }
  }
  if(symbol === 'chf'){
    for(let i=0; i<chfMatches.length; i++){
      matches.push(findMatches(chfMatches[i], newsSet, symbol))
    }
  }
  if(symbol === 'nzd'){
    for(let i=0; i<nzdMatches.length; i++){
      matches.push(findMatches(nzdMatches[i], newsSet, symbol))
    }
  }
  if(symbol === 'aud'){
    for(let i=0; i<audMatches.length; i++){
      matches.push(findMatches(audMatches[i], newsSet, symbol))
    }
  }
  if(symbol === 'cad'){
    for(let i=0; i<cadNatches.length; i++){
      matches.push(findMatches(cadNatches[i], newsSet, symbol))
    }
  }
  if(symbol === 'gbp'){
    for(let i=0; i<gbpMatches.length; i++){
      matches.push(findMatches(gbpMatches[i], newsSet, symbol))
    }
  }
  if(symbol === 'eur'){
    for(let i=0; i<eurMatches.length; i++){
      matches.push(findMatches(eurMatches[i], newsSet, symbol))
    }
  }
  if(symbol === 'usd'){
    for(let i=0; i<usdMatches.length; i++){
      matches.push(findMatches(usdMatches[i], newsSet, symbol))
    }
  }
  let newsName = "";
  let newsTimeTo = 0;

  for(let j=0; j<matches.length; j++){
    //console.log(matches)
      if(matches[j].length > 0){
      var startDate = new Date();
      // Do your operations
      var endDate   = new Date(matches[j][0].date);
      var seconds = (endDate.getTime() - startDate.getTime()) / 1000;

      if(newsTimeTo === 0 || (newsTimeTo>seconds && seconds>0)){
        newsTimeTo=seconds;
        newsName=matches[j][0].title
      }
    }
  }

  return [newsTimeTo, newsName]
}

function findMatches(posMatches, allNews, sym){
  let finds = []
  //console.log(allNews, typeof allNews)
  
  allNews.forEach(news => {
    let newsTags = news.title.toLowerCase().split(' ');
    let checkArray = posMatches.toLowerCase().split(' ')

    Array.prototype.diff = function(arr2) {
      var ret = [];
      this.sort();
      arr2.sort();
      for(var i = 0; i < this.length; i += 1) {
          if(arr2.indexOf(this[i]) > -1){
              ret.push(this[i]);
          }
      }
      return ret;
    }

    //console.log(newsTags.diff(checkArray))

    if(
       //news.impact === "High" && 
       newsTags.diff(checkArray).length>=1 && 
       new Date(news.date) > new Date() &&
       news.country.toLowerCase() === sym){
      finds.push({
        title: news.title,
        date: news.date
      })
    }
  })
  //console.log(finds)
  return finds
}

module.exports = newsFinder;