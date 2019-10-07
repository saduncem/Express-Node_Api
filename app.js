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
var ref = db.ref("datalar/Karikatürler/");
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
app.get("/GetDataList", (req, res) => {
  var data = [];
  ref.child("DataList").once("value", function(snapshot) {
     snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      // childData will be the actual contents of the child
      var childData = childSnapshot.val();
      data.push(childData);
  });
  res.status(200).send({
    success: 'true',
    message: 'data retrieved successfully',
    data: data
  })
});

var maindata = [];
app.get("/data", (req, res) => {
  maindata = [];
  ref.child("DataList").once("value", function(snapshot) {
     snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      // childData will be the actual contents of the child
      var childData = childSnapshot.val();
      maindata.push(childData);
  });
});
   res.render('data',{
    data:maindata
  });
});
   
});

function writeUserData(userId, name, imageUrl,req,res) {
  var dataRef = ref.child("DataList");
   var newPostRef = dataRef.push();
   newPostRef.set(JSON.parse(JSON.stringify({id:newPostRef.key,name:name,url:imageUrl})));
   res.send(req.files);
   res.status(200).end();
}
app.post('/uploadfile', (req, res, next) => {
  const file = req.file
  upload(req, res, err => {
    writeUserData(Date.now(),filename,"/uploads/" +filename,req,res);
  });
  console.log("ana sayfaya gidecek");
  //res.redirect("/list");
});


 const PORT = process.env.PORT|| 3000
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))