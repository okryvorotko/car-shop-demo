import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/ping", (req, res) => {
	res.json({ message: "pong" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚗 Backend running on port ${PORT}`));
