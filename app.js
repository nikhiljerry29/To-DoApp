const express = require("express");
const bodyParser = require("body-parser");
const iquotes = require('iquotes');
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");

const displayDate = date.getDate();

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const workItems = []

const mongooseUrl = "mongodb://localhost:27017/todolistDB";
mongoose.connect(mongooseUrl, { useNewUrlParser: true , useUnifiedTopology: true });

const itemsSchema = new mongoose.Schema({
	description: String
});

const Items = new mongoose.model("item", itemsSchema);

const item1 = new Items ({
	description : "Welcome to your To Do List!!"
});

const item2 = new Items ({
	description : "Hit + button to add a new item."
});

const item3 = new Items ({
	description : "<-- Hit this to delete an item."
});

const defaultItem = [item1, item2, item3];



app.get("/", function(req, res){

	Items.find({},function(err, foundItems) {
		if (foundItems.length === 0) {
			Items.insertMany(defaultItem, function(err) {
				if (err)
					console.log(err + "-m Insertting new element in Items");
				else
					console.log("Sucessfully Saved");
			});	
			res.redirect("");		
		}
		else {
			res.render("list", {
				listCategory : "Personal",
				displayDate : displayDate,
				newListItem : foundItems,
				quotesFull : iquotes.random('life')
			});
		}
	});

});

app.post("/", function(req, res) {
	const itemName = req.body.newItem;
	if (itemName !== ""){
		const newItem = new Items({
			description : itemName
		})
		newItem.save();
		res.redirect("/");
	}

});

app.post("/delete", function(req, res) {
	const checkedItemID = req.body.checkbox;
	Items.findByIdAndRemove(checkedItemID, function(err) {
		if (err)
			console.log("Error in deleting the item");
	});
	res.redirect("/");
});

app.get("/work", function(req, res) {
	res.render("list", {
		listCategory : "Work",
		displayDate : displayDate,
		newListItem : workItems,
		quotesFull : iquotes.random('life')
	});

});

const port = 8080;
app.listen(port, function() {
	console.log('Server started on port :: ' + port);
});
