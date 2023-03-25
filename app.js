// importimi i express
const express = require("express");
const mysql = require("mysql2");

const app = express();

const port = 3000;

app.set("view engine", "ejs");
app.use("/public", express.static("public")); //perdore fajllat statik ne folderin public

app.use(express.json()); // parse data in JSON format
app.use(express.urlencoded({ extended: false })); // parse data from FORMS

//lidhja me databazen
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "bota",
});

app.get("/shtetet", (req, res) => {
  const query = `SELECT * FROM shtetet`;
  db.query(query, (err, results) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(results);
      res.render("shtetet", { shtetet: results });
    }
  });
});

app.get("/shto-shtet", (req, res) => {
  res.render("shto-shtet");
});

app.post("/shto-shtet", (req, res) => {
  const shteti = {
    emri: req.body.emri,
    kontinenti: req.body.kontinenti,
    banore: req.body.banore,
  };

  const sql = `INSERT INTO shtetet (emri, kontinenti, banore) VALUES ('${shteti.emri}','${shteti.kontinenti}', ${shteti.banore})`;

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(results);
    }
  });

  res.redirect("shtetet");
});

app.get("/qytetet", (req, res) => {
  const query = `SELECT qytetet.emri as qyteti, qytetet.banore, shtetet.emri as shteti
  FROM qytetet
  INNER JOIN shtetet
  WHERE shteti = id_shteti `;

  db.query(query, (err, results) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(results);
      res.render("qytetet", { qytetet: results });
    }
  });
});

app.get("/shto-qytet", (req, res) => {
  const query = `SELECT * FROM shtetet`;
  db.query(query, (err, results) => {
    console.log(results);
    res.render("shto-qytet", { results });
  });
});

app.post("/shto-qytet", (req, res) => {
  const qyteti = {
    emri: req.body.emri,
    banore: req.body.banore,
    shteti: req.body.shteti,
  };

  const sql = `INSERT INTO qytetet (emri, banore, shteti) VALUES ('${qyteti.emri}', ${qyteti.banore}, ${qyteti.shteti})`;

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(results);
    }
  });
  res.redirect("qytetet");
});

app.get("/shtetet/:letter", (req, res) => {
  const letter = req.params.letter; // ne variablen letter ruhet shkronja qe perdoruesi e ka kerku

  const query = `SELECT * FROM shtetet WHERE emri LIKE '${letter}%'`;
  db.query(query, (err, results) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(results);
      res.render("shtetet", { shtetet: results });
    }
  });
});

app.get("/delete/shtet/:id", (req, res) => {
  const id = req.params.id;
  console.log(req.params)
  const query = `DELETE FROM shtetet WHERE id_shteti = ${id}`;
  db.query(query, (err, results) => {
    // if (err){
    //   console.log(err.message)
    // } else {
    //   console.log(results)
    res.redirect("/shtetet");
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
