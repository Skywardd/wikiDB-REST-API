const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser=require ("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");

const articleSchema = {
  tittle: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);


// requests targeting all articles:

app.route("/articles")
.get((req,res)=>{  // GET requst - return all articles available in the DB
  Article.find ((err, results)=>{
    if(!err){
      res.send(results);
    }else{
      res.send(err);
    }
  });
})

.post((req,res)=>{ //POST request - post new article trough Postman
const newArticle= new Article ({
  tittle:req.body.tittle,
  content:req.body.content
   });
 newArticle.save((err)=>{
   if(!err){
     res.send("Successfully added");
   } else {
     res.send(err);
   }
 });
})

.delete((req, res)=>{ //DELETE request - delete all articles in the DB

  Article. deleteMany((err)=>{
    if(!err){
      res.send("Successfully deleted all articles")
    }else{
      res.send (err);
    }
  });
});


// requests targeting a specific article
app.route("/articles/:articleTitle")

.get((req,res)=>{ //Get a article with tittle name
  Article.findOne({tittle: req.params.articleTitle}, (err, article)=>{
    if(!err){
      res.send (article);
    }else{
      res.send(err);
    }
  })
})
.put((req,res)=>{ //Update the  article

  Article.updateOne({tittle:req.params.articleTitle},{tittle: req.body.tittle, content: req.body.content},{upsert:true}, (err,results)=>{
    if(!err){
      res.send(results)
    }else{
      res.send (err)
    }
  });

})
.patch((req,res)=>{ //update one parameter from the article
  Article.updateOne({tittle:req.params.articleTitle},{$set:req.body}, (err,results)=>{
    if(!err){
      res.send(results)
    }else{
      res.send (err)
    }
  });
})
.delete((req,res)=>{ //delete a specific article
  Article.deleteOne({tittle:req.params.articleTitle}, (err, result)=>{
   if(!err){
     res.send("success")
   }else{
     res.send(err);
   }
  })
});

app.listen(3000, (req,res)=>{
  console.log ("Server started on port 3000")
});
