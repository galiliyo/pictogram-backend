const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();
const session = require("express-session");
const http = require("http").createServer(app);
const logger = require("./services/LoggerService");
const PostRoutes = require("./api/post/PostRoutes");
const AuthRoutes = require("./api/auth/AuthRoutes");
const UserRoutes = require("./api/user/UserRoutes");
const MongoStore = require("connect-mongo")(session);
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const upload = multer({ dest: "uploads/" });
const cloudinaryConfig = require("./data/config.json").cloudinary;
const config = require("./config");

cloudinary.config(cloudinaryConfig);

app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new MongoStore({ url: config.dbURL })
  })
);
// console.log(
//   " ====================================================================== config.dbURL",
//   config.dbURL
// );

if (process.env.NODE_ENV !== "production") {
  const corsOptions = {
    origin: "http://localhost:8080",
    credentials: true
  };
  app.use(cors(corsOptions));
}
app.use("/api/post", PostRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);

app.post("/upload/cloudinary", upload.single("imgUpload"), async (req, res) => {
  const transformation = [{ angle: 0 }];
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      transformation
    }); //OPTIONS OBJECT
    return await res.json(result);
  } catch {
    res.status(404);
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "public")));
}

const port = process.env.PORT || 3000;
http.listen(port, () => {
  logger.info("Server is running on port: " + port);
});
