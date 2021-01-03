var cheerio = require("cheerio")
var request = require("request");

var config = {
  virgoolUrl : "https://virgool.io/",
  virgoolUserName : "@hjafarzadeh511"
}


function getAllPosts(){
  var posts=[];
  const options = {
    url: config.virgoolUrl + config.virgoolUserName,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66'
    }
  };

  return new Promise(resolve=>{
    new Promise(resolve=>{
      request(options, function (error, response, body){
        if(!error) resolve(body);
        else console.error(error)
      });
    }).then(body => {
      let $ = cheerio.load(body);
      let elements = $(".post-content");
      console.log(`${elements.length} Virgool Posts found` );
      // console.log(elements.children().get(0).text);
      var postFetching = elements.children().map((index, element) => {
        var fetchedPost = {
          postLink : element.attribs.href,
          postTitle : $(".post--title",element).text(),
          postAbstract: $(".post--text",element).text(),
          postCover : $(".post--cover > img",element).attr('src'),
        }
        posts.push(fetchedPost);
      });
      Promise.all(postFetching).then(()=>{
        console.log("Posts are fetched!")
        resolve(posts);
      });
    })
  });
}


function getPostBody(postUrl){
  var body;
  const options = {
    url: postUrl,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66'
    }
  };
  return new Promise(resolve=>{
    new Promise(resolve=>{
      request(options, function (error, response, body){
        if(!error) resolve(body);
        else console.error(error)
      });
    }).then(body => {
      let $ = cheerio.load(body);
      let elements = $(".post-content");
      resolve(`${elements.html()}`);
    })
  });
}


getAllPosts().then(posts=>{
  console.log(posts);

})
getPostBody('https://virgool.io/@hjafarzadeh511/%DA%86%D8%B7%D9%88%D8%B1-%D8%AF%D8%B1-%DB%8C%DA%A9-%D9%85%D8%A7%D9%87-%D8%A8%D8%B1%D8%A7%DB%8C-%D8%A2%DB%8C%D9%84%D8%AA%D8%B3-7-%D8%A2%D9%85%D8%A7%D8%AF%D9%87-%D8%B4%D8%AF%D9%85-hhavkumjtqhr').then(result=>{
  console.log(result)
});
