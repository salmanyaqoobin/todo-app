/**
 * Created by Salman on 12/13/2017.
 */

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'todoApp';

mongoose.connect(url+'/'+dbName,  { useMongoClient: true });

module.exports = {mongoose};

//export default mongoose;