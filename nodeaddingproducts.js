const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "krushna123",
    database: "inventory"
});

app.post("/product", (req, res) => {
    const {
        productname,
        barcode,
        catagory,
        costprice,
        sellingprice,
        gst,
        productdescripion,
        initialstock,
        stockstatus
    } = req.body;

    pool.query(
        `INSERT INTO allproduct
        (productname, barcode, catagory, costprice, sellingprice, gst, productdescripion,initialstock,stockstatus) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ? , ?)`,
        [
            productname,
            barcode,
            catagory,
            costprice,
            sellingprice,
            gst,
            productdescripion,
            initialstock,
            stockstatus
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Insert failed" });
            }
            res.json({ message: "Product inserted successfully" });
        }
    );
});

app.get("/allproduct", (req, res) => {
    pool.query("SELECT * FROM allproduct", (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        res.json(result);
    });
});

app.get("/edit-product/:id", (req, res) => {
    const id = req.params.id;
    pool.query(" SELECT * FROM allproduct WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        res.json(result);
    });
});

// editafter putting in database
app.put("/save-edit/:id", (req, res) => {
    const id = req.params.id;

    const {
        productname,
        barcode,
        catagory,
        sellingprice,
        initialstock,
        stockstatus
    } = req.body;

    const sql = `
        UPDATE allproduct 
        SET productname = ?, barcode = ?, catagory = ?, sellingprice = ?, initialstock = ?, stockstatus = ?
        WHERE id = ?
    `;

    pool.query(
        sql,
        [
            productname,
            barcode,
            catagory,
            sellingprice,
            initialstock,
            stockstatus,
            id
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.json({ message: "Product updated successfully" });
        }
    );
});

// delete

app.delete("/delete-product/:id", (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM allproduct WHERE id = ?";

    pool.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    });
});




app.post("/generate-bill", async (req, res) => {
    const { customerId, items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "No items in bill" });
    }

    const db = pool.promise();

    try {
        for (let item of items) {

            // 1️⃣ get current stock
            const [rows] = await db.query(
                "SELECT initialstock FROM allproduct WHERE id = ?",
                [item.productId]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: "Product not found" });
            }

            if (rows[0].initialstock < item.qty) {
                return res.status(400).json({
                    message: "Insufficient stock"
                });
            }

            // 2️⃣ update stock
            await db.query(
                "UPDATE allproduct SET initialstock = initialstock - ? WHERE id = ?",
                [item.qty, item.productId]
            );
        }

        res.json({ message: "Bill generated & stock updated successfully ✅" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});





app.listen(3000, () => {
    console.log("Server running on port 3000");
});
