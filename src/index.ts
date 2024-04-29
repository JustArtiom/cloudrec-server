import dotenv from "dotenv";
dotenv.config();
import app from "~/express";

app.listen(process.env.API_PORT, () => {
    console.log("API Rest listening!");
});
