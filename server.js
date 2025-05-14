/********************************************************************************
* WEB422 – Assignment 1
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Khiet Van Phan Student ID: 147072235 Date: 14th May, 2025
*
* Published URL: https://github.com/khietvan123/WEB422_A1
*
********************************************************************************/

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();

require('pg'); // explicitly require the "pg" module
const Sequelize = require('sequelize');

const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();

const app = express();
const HTTP_PORT = 8080

app.get("/",(req,res)=>{
    res.send({message:"API Listening"});
});

app.use(cors());

app.use(express.json());

app.use(express.static(__dirname + '/public'));

// POST /api/listings
app.post("/api/listings", async (req, res) => {
    try {
        const listing = await db.addNewListing(req.body);
        res.status(201).json(listing);
    } catch (err) {
        res.status(500).json({ message: `Failed to create listing: ${err.message}` });
    }
});

// GET /api/listings
app.get("/api/listings", async (req, res) => {
    const { page, perPage, name } = req.query;
    try {
        const listings = await db.getAllListings(parseInt(page), parseInt(perPage), name);
        res.status(200).json(listings);
    } catch (err) {
        res.status(500).json({ message: `Failed to retrieve listings: ${err.message}` });
    }
});

// GET /api/listings/:id
app.get("/api/listings/:id", async (req, res) => {
    try {
        const listing = await db.getListingById(req.params.id);
        if (!listing) {
            res.status(404).json({ message: "Listing not found" });
        } else {
            res.status(200).json(listing);
        }
    } catch (err) {
        res.status(500).json({ message: `Error retrieving listing: ${err.message}` });
    }
});

// PUT /api/listings/:id
app.put("/api/listings/:id", async (req, res) => {
    try {
        const result = await db.updateListingById(req.body, req.params.id);
        if (result.matchedCount === 0) {
            res.status(404).json({ message: "Listing not found" });
        } else {
            res.status(200).json({ message: "Listing updated successfully" });
        }
    } catch (err) {
        res.status(500).json({ message: `Error updating listing: ${err.message}` });
    }
});

// DELETE /api/listings/:id
app.delete("/api/listings/:id", async (req, res) => {
    try {
        const result = await db.deleteListingById(req.params.id);
        res.send({message:"Deleted Item"});
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Listing not found" });
        } else {
            res.status(204).send();
        }
    } catch (err) {
        res.status(500).json({ message: `Error deleting listing: ${err.message}` });
    }
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
        });
    }).catch((err)=>{
    console.log(err);
});