const MongoClient = require('mongodb').MongoClient;


MongoClient.connect(process.env.DATABASE_URL, function(err, db) {
  if (err) throw err;
  const dbo = db.db("ewallet");
  const myobj = { balance: 1000, userId: 38298329 };
  dbo.collection("wallet").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});