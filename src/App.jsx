import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Container,
  Drawer,
  Box,
  Divider,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import axios from "axios";

export default function App() {
  const [products, setProducts] = useState([]);
  const [basketCount, setBasketCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [productBasket, setPorductBasket] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const ProductItem = (product) => {
    setPorductBasket((prev) => [...prev, product]);
    setBasketCount((prev) => prev + 1);
  };
  const getTotalPrice = () => {
    return productBasket
      .reduce((total, item) => {
        const price = parseFloat(
          item.price.replace(/[^\d,.-]/g, "").replace(",", ".")
        );
        return total + (isNaN(price) ? 0 : price);
      }, 0)
      .toFixed(2);
  };

  const totalOrder = async () => {
    const total = getTotalPrice();

    try {
      const response = await axios.post("http://localhost:5000/orderAll", {
        total,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error sending order:", error);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              SHOPPING
            </Typography>

            <IconButton color="inherit" onClick={() => setCartOpen(true)}>
              <Badge badgeContent={basketCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Basket
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {productBasket.length > 0 ? (
            <>
              {productBasket.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <img width="40" src={item.image_product} alt={item.name} />
                  <Box>
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="caption">{item.price}</Typography>
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Total: <strong>${getTotalPrice()} USD</strong>
              </Typography>
            </>
          ) : (
            <Typography variant="body2">Basket is empty.</Typography>
          )}
        </Box>

        <Button variant="contained" onClick={totalOrder}>
          Total_Order
        </Button>
      </Drawer>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          <span style={{ color: "#1976d2" }}>
            <strong>SHOPPING Cart</strong>
          </span>
        </Typography>
        <Grid container spacing={3}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <img
                  src={product.image_product}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="textPrimary">
                    {product.price}$
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ m: 2 }}
                  onClick={() => {
                    ProductItem(product);
                  }}
                >
                  Add to Cart
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
