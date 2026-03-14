import { products } from "../data/products.js";

export const getProductByBarcode = (req, res) => {
  const { barcode } = req.params;
  const product = products[barcode];

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
};
