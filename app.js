var path = require('path');
var fs = require('fs');
var express = require('express');
var app = express();
//cookie parsing package
//var cookie = require('cookie');

const MY_PORT = 8080;

var dir = path.join(__dirname, 'public');
app.use(express.static(dir));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
	//res.cookie('same-site-cookie', 'foo', { sameSite: 'lax' });
	//res.cookie('cross-site-cookie', 'bar', { sameSite: 'none', secure: true });
});

app.get("/data/civic-questions.json", (req, res) => {
	res.sendFile(path.join(__dirname, "data", "civic-questions.json"));
});

app.listen(MY_PORT, () => console.log('listening to port ' + MY_PORT));
