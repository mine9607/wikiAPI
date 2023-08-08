import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import ejs from "ejs";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//Connect to a local mongodb server
await mongoose.connect("mongodb+srv://crunchySumo6960:Test-123@cluster0.vwk3y8s.mongodb.net/wikiDB");

const Schema = mongoose.Schema;

//create an article Schema
const articleSchema = new Schema({
  title: String,
  content: String,
});

//create mongoose model within a collection named "Posts"
const ArticleModel = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get(async (req, res) => {
    const foundArticles = await ArticleModel.find({});
    res.send(foundArticles);
  })
  .post((req, res) => {
    const article = new ArticleModel({
      title: req.body.title,
      content: req.body.content,
    });

    article.save();
    res.send("Article successfully saved.");
  })
  .delete(async (req, res) => {
    await ArticleModel.deleteMany();
    res.send("Successfully deleted all articles");
  });

//Create the READ API Verb for finding all articles
// app.get("/articles", async (req, res) => {
//   const foundArticles = await ArticleModel.find({});
//   res.send(foundArticles);
// });

//Create the POST API Verb for creating a new article
// app.post("/articles", (req, res) => {
//   const article = new ArticleModel({
//     title: req.body.title,
//     content: req.body.content,
//   });

//   article.save(function (err) {
//     if (!err) {
//       res.send("Successfully added a new article");
//     } else {
//       return handleError(err);
//     }
//   });
// });

//Create the DELETE API Verb for deleting all articles
// app.delete("/articles", async (req, res) => {
//   await ArticleModel.deleteMany();
//   res.send("Successfully deleted all articles");
// });

//Chained Routing
app
  .route("/articles/:articleTitle")
  .get(async (req, res) => {
    const articleTitle = req.params.articleTitle;
    const foundArticle = await ArticleModel.findOne({ title: articleTitle });
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title found.");
    }
  })
  .put(async (req, res) => {
    const articleTitle = req.params.articleTitle;
    const foundArticle = ArticleModel.findOne({ title: articleTitle });
    const title = req.body.title;
    const content = req.body.content;

    if (foundArticle) {
      await ArticleModel.updateOne({ title: articleTitle }, { title: title, content: content });
      res.send("Article successfully updated.");
    } else {
      res.send("No articles matching that title found.");
    }
  })
  .patch(async (req, res) => {
    const articleTitle = req.params.articleTitle;
    const foundArticle = ArticleModel.findOne({ title: articleTitle });

    if (foundArticle) {
      await ArticleModel.updateOne({ title: articleTitle }, { $set: req.body });
      res.send("Article successfully updated.");
    } else {
      res.send("No articles matching that title found.");
    }
  })
  .delete(async (req, res) => {
    const articleTitle = req.params.articleTitle;
    const deletedArticle = await ArticleModel.deleteOne({ title: articleTitle });
    res.send("Article successfully deleted.");
  });

//Create the READ API Verb for finding specific articles
// app.get("/articles/:_id", async (req, res) => {
//   const articleID = req.params._id;
//   const foundArticle = await ArticleModel.findById({ _id: articleID });
//   console.log(articleID);
//   res.send(foundArticle);
// });

//Create the PUT API Verb for replacing a specific article
// app.put("/articles/:articleTitle", async (req, res) => {
//   const articleTitle = req.params.articleTitle;
//   const foundArticle = ArticleModel.findOne({ title: articleTitle });
//   const title = req.body.title;
//   const content = req.body.content;

//   if (foundArticle) {
//     await ArticleModel.updateOne({ title: articleTitle }, { title: title, content: content });
//     res.send("Article successfully updated.");
//   } else {
//     res.send("No articles matching that title found.");
//   }
// });

//Create the PATCH API Verb for replacing a specific article attribute
app.patch("/articles/:articleTitle", async (req, res) => {
  const articleTitle = req.params.articleTitle;
  const foundArticle = ArticleModel.findOne({ title: articleTitle });

  if (foundArticle) {
    await ArticleModel.updateOne({ title: articleTitle }, { $set: req.body });
    res.send("Article successfully updated.");
  } else {
    res.send("No articles matching that title found.");
  }
});

//Create the DELETE API Verb for a specific article
// app.delete("/articles/:_id", async (req, res) => {
//   const articleID = req.params._id;
//   const deletedArticle = await ArticleModel.deleteOne({ _id: articleID });
//   res.send("Article successfully deleted.");
// });

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
