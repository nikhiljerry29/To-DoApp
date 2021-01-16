const express = require("express");
const bodyParser = require("body-parser");
const iquotes = require('iquotes');

const app = express();

var items = ["Make Bed", "Take Dog for a walk", "Buy Grocery"];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
	var today = new Date();
	
	var options = {
		weekday: "long",
		day: "numeric",
		month: "long"
	};

	var displayDate = today.toLocaleDateString("en-US", options);

	res.render("list", {
		displayDate : displayDate,
		newListItem : items,
		quotesFull : iquotes.random('life')
	});
});

app.post("/", function(req, res) {
	item = req.body.newItem;
	if (item !== "")
		items.push(item)
	res.redirect("/");
});

let port = 8080;
app.listen(port, function() {
	console.log('Server started on port :: ' + port);
});
