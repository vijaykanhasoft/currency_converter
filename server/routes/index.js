var express = require('express');
var router = express.Router();
var axios = require('axios');
const rp = require('request-promise');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/**
 * get single transaction
 */
async function getTransection() {
  const result = await axios.get("https://7np770qqk5.execute-api.eu-west-1.amazonaws.com/prod/get-transaction")
  return result.data
}

/**
 * get EUR rate of given date
 * @param {*} currency 
 * @param {*} year 
 * @param {*} month 
 * @param {*} date 
 */
async function getRate (currency, year, month, date) {
  const result = await axios.get("https://api.exchangeratesapi.io/"+year+"-"+month+"-"+date+"?base="+currency)
  return result.data.rates.EUR
}

/**
 * button click of start convert
 */
router.get('/get_transaction', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  let arr = 100;
  let transactions = [];
  let mains= 0
  let subs= 0

  for(i = 0; i < arr; i++) {
    getTransection()
    .then((result) => {
     transactions.push(result); // get rate and push into array
     mains = mains + 1
     if (mains == 100){
       
       for(let j=0; j<arr;j++){
         let year = new Date(transactions[j].createdAt).getFullYear(); // get year of transaction
         let month = new Date(transactions[j].createdAt).getMonth()+1; // get month of transaction
         let date = new Date(transactions[j].createdAt).getDate(); // get date of transaction
         getRate(transactions[j].currency, year, month, date).then((resp) => {
          subs = subs + 1
          let converted = resp * transactions[j].amount; // count amount in EUR
          transactions[j].convertedAmount = Number.parseFloat(converted).toFixed(4); // add converted value in array
          if (subs == 100){
            res.status(200).send(transactions); // send response to front end
          }
        })
       }
     }
    })
  }
     
});

/**
 * click of Upload button
 * upload data with converted amount
 */
router.post('/uploaddata', function(req, res) {
    axios.post("https://7np770qqk5.execute-api.eu-west-1.amazonaws.com/prod/process-transactions", {transactions: req.body}).then((result) => {
      res.status(200).send(result.data);
    })
});

module.exports = router;
