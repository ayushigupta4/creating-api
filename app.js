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
});


app.listen(3000, function(){
    console.log("Server started");
});
