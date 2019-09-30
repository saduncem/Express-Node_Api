const express = require('express')
const fs = require("fs");
const multer = require('multer');
var firebase  = require("firebase-admin");
const app = express()
const port = 3000

var serviceAccount = require("./serviceAccountKey.json");

firebase .initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://bildirim-sistemi-1470318279122.firebaseio.com"
});

var db = firebase.database();
var ref = db.ref("datalar/Karikatürler");
var filename = "";

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
     cb(null,"./uploads");
    },
    filename:(req,file,cb) =>{
      filename =  file.fieldname + '-' + Date.now() + '.' +file.originalname.split('.')[1];
        cb(null,file.fieldname + '-' + Date.now() + '.' +file.originalname.split('.')[1]);
    }
   });

 const testFolder = './uploads';
 const upload =multer({storage:storage}).single("avatar");
 
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/public', express.static(__dirname + '/css/bootstrap.min.css'));
users = [];
app.get("/", (req, res) => {
  users = [];
  fs.readdirSync(testFolder).forEach(file => {
    users.push(file);
  });
  res.render('index', {
		users: users
  });
});

app.get("/list", (req, res) => {
  res.render('imagelist', {
		users: users
  });
});
app.get("/list", (req, res) => {
  res.render('imagelist', {
		users: users
  });
});
var data = {};
app.get("/data", (req, res) => {
  ref.once("value", function(snapshot) {
   var newPost = snapshot.val();
   console.log("Author: " + newPost.DataList);
});
 
   if(data)
   {
    console.log(data);
    res.render('data',{
      data:data
    });
   }
});

function writeUserData(userId, name, imageUrl) {
  var dataRef = ref.child("DataList");
   var newPostRef = dataRef.push();
   newPostRef.set(JSON.parse(JSON.stringify({id:newPostRef.key,name:name,url:imageUrl})));
}
app.post('/uploadfile', (req, res, next) => {
  const file = req.file
  upload(req, res, err => {
    writeUserData(Date.now(),filename,"/uploads/" +filename);
    res.send(req.files);
  });
  res.redirect("/");
});


 const PORT = process.env.PORT|| 3000
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))