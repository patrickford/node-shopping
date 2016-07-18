var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.update = function(id, name) {
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id) {
            this.items[i].name = name;
            return this.items[i];
        }
    }
    return this.add(name);    
}

Storage.prototype.delete = function(id) {
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id) {
            var removedItem = this.items[i];
            this.items.splice(i, 1);
            return removedItem;
        }
    }
    return "error";
}

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

// Routes
// ------
app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.put('/items/:id', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }  
    var item = storage.update(req.params.id, req.body.name);
    res.status(200).json(item);
});

app.delete('/items/:id', function(req, res) {
    var item = storage.delete(req.params.id);
    if (item === "error") {
      res.sendStatus(404)
    } else {
      res.status(200).json(item);
    }
});

// Listen on port defined in environment variable or default to localhost:8080
app.listen(process.env.PORT || 8080);
console.log('listening on localhost: port 8080');

exports.app = app;
exports.storage = storage;

