import express from "express";
import { postRouter, imageRouter, userRouter, dogRouter } from "./routes/";
import mongoose from "mongoose";
import DATABASE_URL from "./database/database";
import bodyParser from "body-parser";

const cors = require("cors");

mongoose.connect(DATABASE_URL, { autoIndex: true }, () => {
	console.log(`Connected to ${DATABASE_URL}`);
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	next();
});
app.use("/post", postRouter);
app.use("/image", imageRouter);
app.use("/user", userRouter);
app.use("/dog", dogRouter);
app.use("/images", express.static("images"));

app.listen(5000);

export default app;
