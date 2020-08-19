var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req);
  console.log(res);
  fs.writeFileSync('../server/public/' + req.query.filename, req.body.content);
});

module.exports = router;
