/**
 * Created by Salman on 12/14/2017.
 */

const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

var password  = "salman123";

//bcrypt.genSalt(10, function(err, salt) {
//    bcrypt.hash(password, salt, function(err, hash) {
//        console.log(hash);
//    });
//});

var hashedPassword = "$2a$10$NMCProMX4uLlza0y1W2Lren.i0Z9ced.qe18FO8dk64.pSlhAunqW";

bcrypt.compare(password, hashedPassword, (err, res)=>{
    console.log(res);
});


//jwt.sign (Assign token)
//jwt.verify (Verify token)

//var data = {
//    id: 4
//};
//
//var token = jwt.sign(data, 'abc123');
//console.log('token:', token);
//
//let decoded = jwt.verify(token, 'abc123');
//console.log('decoded: ', decoded);

//var message = 'i am user number 3';
//var hash = SHA256(message).toString();
//
//console.log('Message:', message);
//console.log('Hash:', hash);
//
//var data = {
//    id: 4
//};
//
//var token = {
//    data,
//    hash:SHA256(JSON.stringify(data)+'somesecret').toString()
//};
//
//var resultHash = SHA256(JSON.stringify(token.data+'somesecret').toString());
//
//if(resultHash === token.hash){
//    console.log('Data was not changed');
//} else {
//    console.log("data was changed. Do not trust");
//}
//
