const { response } = require('express');
let express = require('express'); //import express, because I want easier management of GET and POST requests.  
//let fs = require('fs');  //fs is used to manipulate the file system
let MySql = require('sync-mysql');  //MySql is used to manipulate a database connection
"use strict";

//set up the database connection 
const options = {
  user: 'b63',
  password: 'K34JT5',
  database: 'b63gold',
  host: 'dataanalytics.temple.edu'
};

// create the database connection
const connection = new MySql(options);

let app = express();  //the express method returns an instance of a app object
app.use(express.urlencoded({extended:false}));  //use this because incoming data is urlencoded

app.use(function(req, res, next) {
    express.urlencoded({extended:false})
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();  //go process the next matching condition
  });

//supporting functions *******************************************************************

// try and catch function
/*
let myFun = function(res,id){

  let txtSQL = "............";

  try{
    //attempt a database call
    var result = connection.query(txtSQL, [id]);
  }

  catch(e){
    // this is a 500 error
    console.log(e)
    responseWrite(res,"Bad! ", 500);
    return;
  }


  // work with result
}
*/
let insertNumber = function(res, quoteowner){
  console.log(quoteowner);
  let txtSQL = "insert into quotes (quoteowner) " + 
    " values (?);"
  try{
    var result = connection.query(txtSQL, [quoteowner]);
  } catch(e){
    console.log(e);
    responseWrite(res, "Unexpected error occured in insertQuote. ",500);
    return;
  }
  //success
  responseWrite(res,result.insertId,200);
}


let insertQuote = function(res,quote, quoteowner){
    console.log(quote,quoteowner);
    let txtSQL = "insert into quotes (quote,quoteowner) " + 
      " values (?,?);"
    try{
      var result = connection.query(txtSQL, [quote,quoteowner]);
    } catch(e){
      console.log(e);
      responseWrite(res, "Unexpected error occured in insertQuote. ",500);
      return;
    }
    //success
    responseWrite(res,result.insertId,200);
}

let getHistory = function(res, quoteowner){

    let txtSQL = "select quote, date(quotecreatedate) as date from quotes where quoteowner = ? AND quote IS NOT NULL";

    try{
      var result = connection.query(txtSQL, [quoteowner]);
    } catch(e){
      console.log(e);
      responseWrite(res, "Unexpected error occurred in getHistory.", 500);
      return;
    }
    if (result.length == 0){
      responseWrite(res, "No quote found for that number.", 400);
      return;
    }
    //success 
    responseWrite(res, result,200);
};

let getNumbers = function(res, quoteowner){
  let txtSQL = "select distinct quoteowner from quotes;"
  try{
    var result = connection.query(txtSQL);
  } catch(e){
    console.log(e);
    responseWrite(res, "Unexpected error occurred in getNumbers.", 500);
    return;
  }
  if (result.length == 0){
    responseWrite(res, "No quote found for that number.", 400);
    return;
  }
  //success 
  responseWrite(res, result,200);

}

// responseWrite is a supporting function.  It sends 
// output to the API consumer and ends the response.
// This is hard-coded to always send a json response.

let responseWrite = function(res,Output,responseStatus){
    res.writeHead(responseStatus, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(Output));
    res.end();
};

//error trapping *********************************************************************************

//feature 1
app.post("/quote",function(req,res,next){

    let quote = req.body.quote;
    let quoteowner = req.body.quoteowner;
    

    if(quote == undefined || quote == ""){
      responseWrite(res,"Error in POST quote. The quote token is missing. It must be a string.", 400);
      return;
    }
    else if(quoteowner == undefined || quoteowner == "" || quoteowner.length != 10){
        responseWrite(res,"Error in POST quote. The quoteowner token is missing. It must be a string with a length of ten.", 400);
        return;
      }
   
    next();
  });

  //feature 2
app.get("/history",function(req,res,next){
  
    let quoteowner = req.query.quoteowner;

  if(quoteowner == undefined || quoteowner == ""||quoteowner.length!=10){
    responseWrite(res,"Error in GET history. The quoteowner token is missing. It must be a string with a length of ten.", 400);
    
    return;
  } 
  
  next();
});


//feature 4
app.post("/numbers",function(req,res,next){

  let quoteowner = req.body.quoteowner;
  

  if(quoteowner == undefined || quoteowner == ""|| quoteowner.length != 10){
      responseWrite(res,"Error in POST quote. The quoteowner token is missing. It must be a string with a length of 10.", 400);
      return;
    }
 
  next();
});


//event handlers ************************************************************************

app.post('/quote',function(req,res){

  let quote = req.body.quote; 
  let quoteowner = req.body.quoteowner;
  console.log(quote,quoteowner);
  insertQuote(res,quote,quoteowner);

});

app.get('/history',function(req,res){
    
  let quoteowner = req.query.quoteowner; 
  getHistory(res,quoteowner);

});

app.get('/numbers',function(req,res){

  getNumbers(res);

});


app.post('/numbers',function(req,res){

  
  let quoteowner = req.body.quoteowner;
  console.log(quoteowner);
  insertNumber(res,quoteowner);

});


//what the app should do when it received a "GET" against the root
app.get('/', function(req, res) {
    //what to do if request has no route ... show instructions
    let message = [];
    
    message[message.length] = "To insert a quote, issue a POST against ./quote and " +
    "provide a quote and quoteowner. " + 
    "The result will be the quoteid created by this feature.";
    message[message.length] = "To get quote history, issue a GET against ./history" + 
    " and provide the user phone number. The result will be a JSON object with a user's quote history.";
    message[message.length] = "To get unique numbers, issue a GET against ./numbers" + 
    " The result will be a JSON object with unique phone numbers.";
    message[message.length] = "To add a user to the system, issue a POST against ./numbers" + 
    " and provide the user phone number. The result will be a JSON object with a user's quote history.";

	responseWrite(res,message,200);

    return;
});
  
//This piece of code creates the server  
//and listens for requests on a specific port
//we are also generating a message once the 
//server is created
let server = app.listen(8211, "0.0.0.0" ,function(){
    let host = server.address().address;
    let port = server.address().port;
    console.log("The endpoint server is listening on port:" + port);
});