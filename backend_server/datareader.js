function dbQuery (collection, params, action) {
  return new Promise( (resolve, reject) => {
    if (action === 'findOne') {
      collection.findOne(params,  (e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
    else if (action === 'updateOne') {
      collection.updateOne(params.query, params.objNew,  (e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
    else if (action === 'update') {
      collection.updateOne(params.query, params.objNew, params.multi,  (e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
    else if (action === 'find') {
      collection.find(params,  (e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
    else if (action === 'findExField') {
      collection.find(params.query1, params.query2,  (e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
    else if (action === 'findById') {
      collection.findById(params, (e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
    else if (action === 'findElementMatch') {
      collection.find(params.query, params.elementMatch,(e, d) => {
        if (e) reject(e);
        else resolve(d)
      })
    }
    else if (action === 'findOneElementMatch') {
      collection.findOne(params.query, params.elementMatch, (e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
    else if (action === 'save') {
      collection.save((e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
   
  })
}

module.exports = dbQuery;