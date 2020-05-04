var express = require('express');
var router = express.Router();
var multer = require('multer');
const sqlite3 = require('sqlite3').verbose();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

var upload = multer({ storage: storage })

/* GET create blog. */
router.get('/create', function (req, res, next) {
  res.render('create', { title: 'Create Blog' });
});

/*single file upload*/
router.post('/upload', upload.single('blogimage'), function (req, res, next) {
  var fileinfo = req.file;
  var title = req.body.title;
  console.log(title);
  res.send(fileinfo);
})

/*multiple files upload*/
router.post('/uploads', upload.array('blogimage', 5), function (req, res, next) {
  var fileinfo = req.files;
  var title = req.body.title;
  console.log(title);
  res.send(fileinfo);
})

router.get('/sqlite', function (req, res, next) {
  console.log('sqlite db')
  // open the database
  let db = new sqlite3.Database('abcd2');

  db.serialize(function () {
    db.run("CREATE TABLE user (id INT, dt TEXT)");

    var stmt = db.prepare("INSERT into user VALUES(?,?)");
    for (var i = 0; i < 10; i++) {
      var d = new Date();
      var n = d.toLocaleTimeString();
      stmt.run(i, n);
    }
    stmt.finalize();

    db.each("SELECT id, dt from user", function (err, row) {
      console.log("User id : " + row.id, row.dt);
    })

  })
  db.close();

})
module.exports = router;