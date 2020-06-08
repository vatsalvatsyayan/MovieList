var express = require('express');
var app = express();
var request = require('request');
app.set("view engine", "ejs");

app.use('/assets',express.static('assets'));

app.get("/",function(req, res){
    res.render("search")
})

app.get('/results',function(req,res){
    var query = req.query.search;
    var url = "http://www.omdbapi.com/?s=" + query +"&apikey=e58f3a8e"

    request(url,function(error, response, body){
        if(!error && response.statusCode >= 200){
            console.log(body);
            var data = JSON.parse(body);
            //res.send(data)
            

            res.render("results",{data:data})
        }
    });

    
});




app.listen(4000,function(){
    console.log("working");
})

