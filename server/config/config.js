/**
 * Created by Salman on 12/14/2017.
 */
var env = process.env.NODE_ENV || 'development';
//console.log('env ******', env);

if(env === 'development'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/todoApp';
} else if(env === 'test'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/todoApp-test';
}
