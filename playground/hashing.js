/**
 * Created by Salman on 12/14/2017.
 */

const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

//jwt.sign (Assign token)
//jwt.verify (Verify token)

var data = {
    id: 4
};

var token = jwt.sign(data, 'abc123');
console.log('token:', token);

let decoded = jwt.verify(token, 'abc123');
console.log('decoded: ', decoded);

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
