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

app.post("/customer", (req, res) => {
    const {
        name,
        phone,
        email,
        totalpurchase,
        outstanding
    } = req.body;

    pool.query(
        `INSERT INTO customers
        (name,phone,email,totalpurchase,outstanding) 
        VALUES (?, ?, ?, ?, ?)`,
        [
            name,
            phone,
            email,
            totalpurchase,
            outstanding
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Insert failed" });
            }
            res.json({ message: "Customer inserted successfully" });
        }
    );
});
app.get("/customers", (req, res) => {
    pool.query("SELECT * FROM customers", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to fetch customers" });
        }
        res.json(result);

    })

})
// editing the customer
app.get("/editcustomer/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM customers WHERE id = ?";
    pool.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err)
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json(result[0]); // ✅
    })
})


// editing in the databbase
app.put("/updatecustomer/:id", (req, res) => {
    const id = req.params.id;

    const { name, phone, email, totalpurchase, outstanding } = req.body;

    const sql = `
        UPDATE customers 
        SET name = ?, phone = ?, email = ?, totalpurchase = ?, outstanding = ?
        WHERE id = ?
    `;

    pool.query(
        sql,
        [name, phone, email, totalpurchase, outstanding, id],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Customer not found" });
            }

            res.json({ message: "Customer updated successfully" });
        }
    );
});



// deleting the user

app.delete("/delete-customer/:id", (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM customers WHERE id = ?";

    pool.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json({ message: "Customer deleted successfully" });
    });
});



app.listen(3500, () => {
    console.log("Server running on port 3500");
});
