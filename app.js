var express = require('express');
var app = express();
var request = require('request');
app.set("view engine", "ejs");

app.use('/assets',express.static('assets'));

var bodyParser = require('body-parser');

var completed = [];
var towatch = [];



var urlencoded = bodyParser.urlencoded({extended:false});

app.get("/",function(req, res){
    res.render("search")
})

app.get('/results',function(req,res){
    var query = req.query.search;
    var url = "http://www.omdbapi.com/?s=" + query +"&apikey=e58f3a8e"

    request(url,function(error, response, body){
        if(!error && response.statusCode >= 200){
            // console.log(body);
            var data = JSON.parse(body);
            //res.send(data)
            
            

            res.render("results",{data:data})
        }
    });

    
});

app.post('/info',urlencoded, function(req,res){
    console.log(req.body.movielink);

    request(req.body.movielink,function(error, response, body){
        if(!error && response.statusCode >= 200){
            var data = JSON.parse(body);

            
           

            res.render("info",{data:data});
        }
    })

});

app.post('/completed',urlencoded, function(req,res){
    console.log(req.body.movielink);

    request(req.body.movielink,function(error, response, body){
        if(!error && response.statusCode >= 200){
            var data = JSON.parse(body);

            
            completed.push(data);
            console.log("After this")
            console.log(completed);

            
            console.log(data);

            res.render("completed",{data:data,user:completed});
        }
    })

});

app.get('/completed',function(req,res){
    res.render("completed",{user:completed});
})

app.post('/towatch',urlencoded, function(req,res){
    console.log(req.body.movielink);

    request(req.body.movielink,function(error, response, body){
        if(!error && response.statusCode >= 200){
            var data = JSON.parse(body);

            
            towatch.push(data);
            

            
            

            res.render("towatch",{data:data,user:towatch});
        }
    })

});

app.get('/towatch',function(req,res){
    res.render("towatchget",{user:towatch});
})





app.listen(4000,function(){
    console.log("working");
})

