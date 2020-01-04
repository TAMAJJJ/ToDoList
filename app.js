
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});

const itemsSchema = {
    name : String
};

const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
    name : "Welcome to you Todo List"
});

const item2 = new Item({
    name : "Hit + to add a new item"
});

const item3 = new Item({
    name : "<-- Hit this to delete an item"
});

const defaultItems = [item1,item2,item3];

const listSchema = {
    name : String,
    items : [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/",function(req,res){

    var day = date();

    Item.find({},function(err,foundItems){
        if(foundItems.length === 0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Successfully saved default items to the DB.");
                }
            });
            res.redirect("/");
        }else{
            res.render('list', {listTitle : day, newItems : foundItems});
        }
    });

});

app.get("/:customListName",function(req,res){
    const listName = req.params.customListName;

    List.findOne({name:listName},function(err,foundList){
        if(!err){
            if(!foundList){
                //create a new list
                const list = new List({
                    name : listName,
                    items : defaultItems
                });

                list.save();
                res.redirect("/" + listName);
            }else{
                //show the existing list
                res.render('list', {listTitle : foundList.name, newItems : foundList.items});
            }
        }
    });
});

app.post("/",function(req,res){
    var newItem = req.body.newItem;
    var listName = req.body.list;

    const item = new Item({
        name : newItem
    });

    var day = date();

    if(listName === day){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name : listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }


});

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === day){
        Item.findByIdAndRemove(checkedItemId, function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Successfully deleted the checked item from DB.");
            }
        });

        res.redirect("/");
    }else{

    }

});

app.listen(3000, function(req,res){
    console.log("Server starting on port 3000...");
});
