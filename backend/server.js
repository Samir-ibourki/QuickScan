import express from "express";
import cors from "cors";
import morgan from "morgan";
import productRoutes from "./src/routes/productRoutes.js";
import printerRoutes from "./src/routes/printerRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); 

// routes
app.use("/product", productRoutes);
app.use("/print", printerRoutes);

app.get("/", (req, res) => {
  res.send("QuickScan POS API is running...");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Accessible locally at: http://192.168.8.11:${PORT}`);
});

