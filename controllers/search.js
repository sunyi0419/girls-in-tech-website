exports.index = function (req, res, next) {
  var q = req.query.q;
  q = encodeURIComponent(q);
  res.redirect('https://www.google.com/#hl=en&q=site:girlsin.technology+' + q);
};
