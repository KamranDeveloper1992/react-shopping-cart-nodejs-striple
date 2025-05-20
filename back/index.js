const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
require("dotenv").config();
console.log(process.env);
const mysqli = require("mysql2");
const bodyParser = require("body-parser");
const app = express();

const stripe = Stripe(process.env.stripeKey);

const port = 5000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const connection = mysqli.createConnection({
  host: process.env.Host,
  user: process.env.Users,
  password: process.env.Password,
  database: process.env.Database_Name,
});

app.get("/products", (req, res) => {
  connection.query("SELECT * FROM products_item", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving products");
    } else {
      res.status(200).json(results);
    }
  });
});

app.post("/orderAll", async (req, res) => {
  const { total } = req.body;
  console.log("Total from frontend:", total);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Shopping Basket",
            },
            unit_amount: Math.round(parseFloat(total) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ error: err.message });
  }
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

app.listen(port);
