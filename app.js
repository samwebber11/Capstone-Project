const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./config/db').mongoURI;
const passport = require("passport");
const users = require("./routes/apis/users");
const handlebars = require('express-handlebars');

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

app.use(express.static(__dirname + '/Render'));
// app.set('views',path.join(__dirname, 'views'));
app.engine('handlebars',handlebars({defaultLayout:'layout'}));
app.set('view engine','handlebars');

app.use(passport.initialize());
require("./config/passport")(passport);
app.use("/",users);

const port = process.env.PORT || 5000 ;
app.listen(port, () => console.log(`Express is listening to ${port} .`));