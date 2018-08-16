function datareader(collection, params) {
  return new Promise( (resolve, reject) => {
    collection.findOne(params,  (e, d) => {
      if (e) reject(e);
      else resolve(d);
    })
  })
}

module.exports = datareader;