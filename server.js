const express = require("express");
const server = express();

//Configure server for statics files 
server.use(express.static('public'))

server.use(express.urlencoded({ extended: true }))

//configure connect with db
const Pool = require('pg').Pool
const db = new Pool({
    user: 'tfsiqueira',
    password: 'qwe123',
    host: 'localhost',
    port: 5432,
    database: 'thiagodb'
});


//Configure template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})



//configure page display
server.get("/", function(req, res) {

    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Error in the Database.")

        const donors = result.rows;
        return res.render("index.html", { donors });
    });

})

server.post("/", function(req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("All fields are mandatory!")
    }

    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)
    `

    const values = [name, email, blood];

    db.query(query, values, function(err) {
        if (err) return res.send("Error in the Database");

        return res.redirect("/");
    });





})



server.listen(3000, console.log("server iniciado"));