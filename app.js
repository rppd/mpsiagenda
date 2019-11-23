const express = require("express");
const fs = require("fs");

var app = express();

var fc = fs.readFileSync("data.json");
try {
    db = JSON.parse(fc);
    console.log("Fetched database from data.json.")
} catch (e) {
    db = {
        "tasks": [],
        "byDate": [],
        "fields": {
            "Maths": [],
            "Physique": [],
            "SI": [],
            "IPT" : [],
            "Anglais":  [],
            "Français" : []
        }
    };
    saveData(db);
    console.log("Recreated and saved database to data.json.")
}

var taskid = 0;
for (var i = 0; i < db.tasks.length; i++) {
    if (db.tasks[i].id >= taskid) {
        taskid = db.tasks[i].id + 1
    }
}

app.use(express.static("static"));
app.use(express.urlencoded());
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("home.ejs", {
        fields : Object.keys(db.fields),
        recent : [db.dates]
    });
})

app.get("/new", function(req, res) {
    res.render("new.ejs");
});

app.post("/new", function(req, res) {
    var date = req.date;
    var field = req.field;
    var text = req.text;
    var add = req.add;
    if (!Object.keys(db.byDate).includes(date)) {
        db.byDate[date]= [];
    }
    var taskExists = false;
    var taskFound;
    db.byField[field].foreach(function(task){
        if (db.byField[field][i].date == date) {
            taskExists = true;
            taskFound = db;
            return;
        }
    });
    if (taskExists) {
        if (add == "add") {
            taskFound.text += "\n" + text;
        } else {
            task.text = text;
        }
    } else {
        var task = {
            id : taskid,
            text : task,
            date : date
        }
        db.tasks.push(task);
        if (!Object.keys(db.byDate).includes(date)) {
            db.byDate[date] = [taskid]
        } else {
            db.byDate[date].push(taskid);
        }
        db.byField.push(taskid);
        taskid += 1;
    }
});

app.listen(8080);

function saveData(data) {
    fs.writeFileSync("data.json", JSON.stringify(data));
}

function existingDates(data) {

}