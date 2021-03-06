const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get(function(req, res){
  Article.find({}, function(err, foundArticles){
    if(!err)
    res.send(foundArticles);
    else
    res.send(err);
  });
})

.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err)
    res.send("Succesfully added the new article.");
    else
    res.send(err);
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err)
    res.send("successfully deleted all the articles.");
    else
    res.send(err);
  });
});
////////////////////////////////////Paticular routes/////////////////////////////////////////////////////
app.route("/articles/:articleTitle")

.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle)
    res.send(foundArticle);
    else
    res.send("No article exists with this title.");
  });
})

.put(function(req, res){
  Article.update({title: req.params.articleTitle},
  {title: req.body.title, content: req.body.content},
  { overwrite: true},
function(err){
  if(!err){
    res.send("successfully updated the article.")
  }
});
})

.patch(function(req, res){
  Article.update({title: req.params.articleTitle},
  {$set: req.body},
  function(err){
    if(!err)
    res.send("Successfully Updated!");
    else
    res.send(err);
  });
})

.delete(function(req, res){
  Article.deleteOne({title: req.params.articleTitle}, function(err){
    if(!err)
    res.send("Successfully Deletd!");
    else
    res.send(err);
  });
});






















app.listen(3000, function(){
  console.log("Server is up and running");
})
