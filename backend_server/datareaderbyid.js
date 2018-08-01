function datareaderById(collection, params) {
  return new Promise( (resolve, reject) => {
    collection.findById(params,  (e, d) => {
      if (e) reject(e);
      else resolve(d);
    })
  })
}

module.exports = datareaderById;
