require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const colors = require("colors");

const app = express();

global.appRoot = path.resolve(__dirname);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

const db = mongoose
  .connect(
    "mongodb://" +
      process.env.DB_HOST +
      ":" +
      process.env.DB_PORT +
      "/" +
      process.env.DB_NAME,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => console.log("MongoDB Connected".green.inverse))
  .catch((e) => console.log(`${e}`.underline.red));
mongoose.set("useFindAndModify", false);

app.use("/avatars", express.static(path.join(__dirname, "public/img/avatars")));

/*app.get("/", function(req, res) {
  res.sendFile("index.html", { root: path.join(__dirname, "dist") });
});*/

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server started on port ${port}`.blue.inverse)
);
