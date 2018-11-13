const request = require('request');
const fs = require('fs');
const setCookie = require('set-cookie-parser');


const url_base = 'http://api.olhovivo.sptrans.com.br/v2.1/';
const login_route = 'Login/Autenticar?token='
const token = '7bb876e44542842505ed5b13d70a959c28c31773f28700bafec208961fe382f0';
let cookieString = ''


// Getting position for all buses in SPTrans
function get_position_all_buses(sampling_rate,time_update){

  time_accumulated = 0

  // Run each 5 seconds
  setInterval(function() {
    let date;
    time_accumulated += sampling_rate * 1000

    // Getting new authentication every time_update seconds
    if(time_accumulated%(time_update*1000) == 0 && time_accumulated != 0){
      auth();
    }
    let options_position = {
      method: 'GET',
      uri: url_base + 'Posicao',
      json: true, // Automatically stringifies the body to JSON,
      headers:{
        'Cookie': 'apiCredentials='+cookieString
      }
    }

    let p1 = new Promise((resolve, reject) => {
      date = new Date()
      request(options_position,function(error, res, body){
        if(res.statusCode == 200){
          resolve(body)
        }else{
          reject(error)
        }
      })
    })
    .then((body) => {
      let file_name = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + "_" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + ".json"
      fs.writeFile("./data/"+file_name, JSON.stringify(body), function(err) {
        if(err) {
          console.log("File error!")
        }else{
          console.log("File success!")
        }
      });
    })
    .catch((error) =>{
      console.log("Error on getting data");
      console.log(error);
    })
  }, sampling_rate * 1000);
}


// Authentication
function auth(){
  // Authentication
  let options_auth = {
      method: 'POST',
      uri: url_base + login_route + token,
      json: true // Automatically stringifies the body to JSON
  };

  return new Promise((resolve, reject) => {
    request(options_auth, function(error, response, body){
      if(response.statusCode == 200){
        let combinedCookieHeader = response.headers['set-cookie'];
        let splitCookieHeaders = setCookie.splitCookiesString(combinedCookieHeader);
        let cookies = setCookie.parse(splitCookieHeaders);
        cookieString = cookies[0].value;
        console.log(cookieString)
        resolve("Authentication ok!");
      }else{
        reject("Authentication error");
      }
    });
  })
  .then((msg) =>{
    console.log(msg)
  })
  .catch((err) =>{
    console.log(err)
  })
}

// Authentication - first call
auth()
.then((success)=>{
  get_position_all_buses(60,600)
})
.catch((error)=>{
  console.log("Error first authentication!")
})
