const express = require("express");
const bodyParser = require("body-parser");
const iquotes = require("iquotes");
const mongoose = require("mongoose");
const _ = require("lodash");

const date = require(__dirname + "/date.js");

const displayDate = date.getDate();

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const mongooseUrl =
  process.env.MONGOURI || "mongodb://localhost:27017/todolistDB";
mongoose.connect(mongooseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = new mongoose.Schema({
  description: String,
});

const Items = new mongoose.model("item", itemsSchema);

const item1 = new Items({
  description: "Welcome to your To Do List!!",
});

const item2 = new Items({
  description: "Hit + button to add a new item.",
});

const item3 = new Items({
  description: "<-- Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const List = new mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Items.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Items.insertMany(defaultItems, function (err) {
        if (err) console.log(err + "-m Insertting new element in Items");
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listCategory: "Personal",
        displayDate: displayDate,
        newListItem: foundItems,
        quotesFull: iquotes.random("life"),
      });
    }
  });
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });

        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listCategory: foundList.name,
          displayDate: displayDate,
          newListItem: foundList.items,
          quotesFull: iquotes.random("life"),
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  if (itemName !== "") {
    const newItem = new Items({
      description: itemName,
    });

    if (listName === "Personal") {
      newItem.save();
      res.redirect("/");
    } else {
      List.findOne({ name: listName }, function (err, foundList) {
        foundList.items.push(newItem);
        foundList.save();

        res.redirect("/" + listName);
      });
    }
  }
});

app.post("/delete", function (req, res) {
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Personal") {
    Items.findByIdAndRemove(checkedItemID, function (err) {
      if (err) console.log("Error in deleting the item");
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemID } } },
      function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

const newLocal = process.env.PORT;
let port = newLocal;
if (port == null || port == "") {
  port = 8080;
}
app.listen(port, function () {
  console.log("Server started on port :: " + port);
});
