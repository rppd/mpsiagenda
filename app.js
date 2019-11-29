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
    var today = getToday();
    var tasks = {};
    for (var date = today; date < today+7; date++) {
        if (typeof(db.tasks[date]) != "undefined")
        tasks[date] = db.tasks[date];
    }  
    res.render("home.ejs", {
        fields : db.fields,
        tasks: tasks
    });
})

app.get("/new", function(req, res) {
    var date = new Date();
    var today = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
    res.render("new.ejs", {
        fields: db.fields,
        today : today
    });
});

app.get("/byfield", function(req, res) {
    var field = db.fields[req.body.field];
    var today = getToday();
    var tasks = {}
    for (var date = today; date < today+7; date++) {
        if (Object.keys(db.tasks).includes(date)) {
            var arr =  []
            db.tasks[date].foreach(function(task) {
                if (tasks.field == field) arr.push(task)
            })
            tasks[date] = arr;
        }
    }
    res.render("byfield.ejs", {
        fields : db.fields,
        tasks : tasks 
    });
});

app.post("/new", function(req, res) {
    var date = req.body.date;
    var field = req.body.field;
    var text = req.body.text;

    date = date.split("-").join("/"); //yy-mm-jj to yy/mm/jj
    date = Math.ceil(Date.parse(date)/1000/3600/24); //date to day-level timestamp (n of days since epoch)

    var task = {
        field : field,
        text : text
    }

    if (Object.keys(db.tasks).includes(date.toString())) {
        db.tasks[date].push(task)
    } else {
        db.tasks[date] = [task]
    }
    res.redirect("/new");
    saveData(db);
});

app.listen(8080);
console.log("Listening to 8080");

async function saveData(data) {
    fs.writeFileSync("data.json", JSON.stringify(data));
}


function getToday() {
    var date = new Date();
    return Math.floor(date.getTime()/1000/3600/24);
}