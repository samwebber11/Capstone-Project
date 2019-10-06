const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./config/db').mongoURI;
const passport = require("passport");
const users = require("./routes/apis/users");

const app = express();

app.use(
    bodyparser.urlencoded({
        extended:false,
    })
);

app.use(bodyparser.json());

mongoose.connect(
    db,
    { useNewUrlParser : true }
)
.then(() => console.log('MongoDb connected successfully'))
.catch(err => console.log(err));


app.use(passport.initialize());
require("./config/passport")(passport);
app.use("/apis/users",users);

const port = process.env.PORT || 5000 ;
app.listen(port, () => console.log(`Express is listening to ${port} .`));