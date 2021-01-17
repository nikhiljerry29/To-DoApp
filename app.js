const express = require("express");
const bodyParser = require("body-parser");
const iquotes = require('iquotes');
const date = require(__dirname + "/date.js");

const displayDate = date.getDate();

const app = express();

const items = ["Make Bed", "Take Dog for a walk", "Buy Grocery"];
const workItems = []

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
	res.render("list", {
		listCategory : "Personal",
		displayDate : displayDate,
		newListItem : items,
		quotesFull : iquotes.random('life')
	});
});

app.post("/", function(req, res) {
	const item = req.body.newItem;
	if (item !== ""){
		if(req.body.list === "Work") {
			workItems.push(item);
			res.redirect("/work");
		}else {
			items.push(item);
			res.redirect("/");
		}
	}

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
