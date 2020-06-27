var express = require('express');
var mongoose = require('mongoose')
var app = express();
var request = require('request');
app.set("view engine", "ejs");

app.use('/assets',express.static('assets'));

mongoose.connect('mongodb+srv://Vatsal:test@cluster0-rqxu9.mongodb.net/MovieList?retryWrites=true&w=majority')

var movieSchema = new mongoose.Schema({
    Title: String,
    Year: String,
    Runtime: String,
    imdbRating: String,
    imdbID: String
});

var completed = mongoose.model('completed',movieSchema);
var toWatch  = mongoose.model('toWatch',movieSchema);

var bodyParser = require('body-parser');
mongoose.set('useFindAndModify', false);




var urlencoded = bodyParser.urlencoded({extended:false});

app.get("/",function(req, res){
    res.render("search")
})

app.get('/results',function(req,res){
    var query = req.query.search;
    var url = "http://www.omdbapi.com/?s=" + query +"&apikey=e58f3a8e"

    request(url,function(error, response, body){
        if(!error && response.statusCode >= 200){
           
            var data = JSON.parse(body);
            
            res.render("results",{data:data})
        }
    });

    
});

app.post('/info',urlencoded, function(req,res){
    

    request(req.body.movielink,function(error, response, body){
        if(!error && response.statusCode >= 200){
            var data = JSON.parse(body);
             res.render("info",{data:data });
        }
    })

});

app.post('/completed',urlencoded, function(req,res){
    
    request(req.body.movielink,function(error, response, body){
        if(!error && response.statusCode >= 200){
            var data = JSON.parse(body);

            console.log(data);
            
            var complete = {
                Title: data.Title,
                Year: data.Year,
                Runtime: data.Runtime,
                imdbRating: data.imdbRating,
                imdbID: data.imdbID
            }

             completed.find({imdbID:data.imdbID},function(err, check){
                if(check.length != 0){
                    
                    res.render("exists");
                }else{
                    var addToCompleted = completed(complete).save(function(err,completed){
                        if(err) throw err;
                        res.render("search");
        
                    })
                }
            })    
        }
    })

});

app.get('/completed',function(req,res){
    completed.find({}, function(err,completed){
        if(err) throw err;
        res.render("completed",{user:completed});
    });
    
})

app.post('/towatch',urlencoded, function(req,res){
  
    request(req.body.movielink,function(error, response, body){
        if(!error && response.statusCode >= 200){
            var data = JSON.parse(body);

            console.log(data);

            var pending = {
                Title: data.Title,
                Year: data.Year,
                Runtime: data.Runtime,
                imdbRating: data.imdbRating,
                imdbID: data.imdbID
            }

            toWatch.find({imdbID: data.imdbID},function(err,check){
                if(check.length!=0){
                    res.render("exists");
                }else{
                    var addToWatch = toWatch(pending).save(function(err,completed){
                        if(err) throw err;
                        res.render("search");
        
                    })
                }
            })
   
        }
    })

});

app.get('/towatch',function(req,res){
    toWatch.find({}, function(err,towatch){
        if(err) throw err;
        
        
        res.render("towatch",{user:towatch});
    });
})

app.post("/toremove/:id",function(req,res){
    
    completed.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.send("error");
        } else {
            res.send("done");
        }
    })

    
})








app.listen(4000,function(){
    console.log("working");
})

