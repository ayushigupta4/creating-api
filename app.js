const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({entended:true}));
app.use(express.static('public'));

async function connectToDatabase() {
    try {
        await mongoose.connect("mongodb://localhost:27017/mytestdb", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
connectToDatabase();

const articleSchema = new mongoose.Schema({
    author: String,
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);
app.get("/articles", async function(req,res) {
    
    const articleData = await findArticle();
    res.send(articleData);
});

async function findArticle() {
    
    try {
        const articleData = await Article.find();
        console.log("find successful");
        //console.log( "here: ", articleData);

        return articleData;
    } catch(error) {
        console.error("Error finding: ", error);
        return [];
    }
}

app.post("/articles", function(req,res){
    const newArticle = new Article({
        author: req.body.author,
        title: req.body.title,
        content: req.body.content
    })

    newArticle.save();
    res.send("Save successful");
});

app.delete("/articles", async function(req,res){
    try {
        await Article.deleteMany();
        res.send("Delete successful");
    }catch(error) {
        console.error("Error while deleting: ",error);
    }
})

app.get("/articles/:articleTitle", async function(req,res){
    try {
        const articleFound = await Article.findOne({title: req.params.articleTitle});
        if(articleFound) {
            res.send(articleFound.content);
        }
        else{
            res.status(404).send("Article not found");
        }
    } catch(error) {
        console.error("Error: ",error);
    }
});

app.put("/articles/:articleTitle", async function(req,res){
    try {
        await Article.updateOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content },
            {overwrite: true});
        res.send("Update successful");    
    } catch(error) {
        console.error("Error while update: ",error);
    }
});

app.patch("/articles/:articleTitle", async function(req,res){
    try {
        await Article.updateOne(
            {title: req.params.articleTitle},
            {$set: {content: req.body.content}}
        )
        res.send("Patch request successful");
    } catch(error) {
        console.error("Error while patching: ",error);
    }
});

app.delete("/articles/:articleTitle", async function(req,res){
    try {
        await Article.deleteOne({title: req.params.articleTitle});
        res.send("delete successful");
    } catch(error) {
        console.error("Error while deleting: ",error);
    }
    

});

app.listen(3000, function(){
    console.log("Server started");
});
