const express = require("express");
const path = require("path");
const fs = require("fs");
const { error } = require("console");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.set(`view engine`,`ejs`);

app.get("/",(req,res)=>{
    fs.readdir("./formdata", (err,allfiles)=>{
        if(err)
        {
            console.log("error");
        }
        else
        {
            res.render("index",{files : allfiles});
        }
    })
})

app.get("/files/:filename",(req,res)=>{
    // res.render("showfiles", {});
    fs.readFile(`./formdata/${req.params.filename}`,`utf-8`,(err,filedata)=>{
        res.render("showfiles",{filename : req.params.filename , filedata: filedata});
    })
})

app.get("/update/:filename",(req,res)=>{
    // res.render("updatefilename")
    fs.readFile(`/formdata/${req.params.filename}`,`utf-8`,(err,filedata)=>{
        res.render("updatefilename",{prevname: req.params.filename});
    })
})

app.get("/delete/:filename",(req,res)=>{
    // res.send(req.params.filename);
    fs.unlink(`./formdata/${req.params.filename}`,(err)=>{
        if(err)
        console.log(err);
        else{
            res.redirect("/");
        }
    })
    
})


app.post("/update",(req,res)=>{
    // console.log(req.body.new);
    fs.rename(`./formdata/${req.body.previous}`,`./formdata/${req.body.new}`,(err)=>{
        if(err)
        console.log(err)
    })
    res.redirect("/");
})

app.post("/create",(req,res)=>{
    fs.access("./formdata",(err)=>{
        if(err)
        {
            fs.mkdir("./formdata",(err)=>{
                if(err)
                {
                   console.error(err)
                }
                else
                {
                    console.log("directory created successfully");
                }
            })
        }
        else{
            console.log("directory already exists");
        }
    })

    fs.writeFile(`./formdata/${req.body.title.split(" ").join("")}.txt`, req.body.detail , function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    res.redirect("/");
})

app.get("/dynamichtml",(req,res)=>{
    res.render("index");
})

app.listen(3000,()=>{
    console.log(`server is running on http://localhost:3000`);
})