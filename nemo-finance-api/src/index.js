const express = require('express')
const app = express();

const markets_data = require('./data/markets_data.json');
const proposals_data = require('./data/proposals_data.json');
const transactions_data = require('./data/transactions_data.json');

//todo : getMarketHistory for each nToken address and type
//todo : getVoterAccounts : /voters/accounts
//todo : getVotersDetails :
//todo : getVotersHistory :
//todo : getVoters        : 
app.get('/governance/nemo', (req,res) => {
    res.json(markets_data);
})

app.get('/proposals?offset=0&limit=5', (req,res) => {
    res.json(proposals_data);
})

app.get('/transactions?page=0&order=blockNumber&sort=desc&version=v2', (req,res)=> {
    res.json(transactions_data);
})
app.listen(8080, () => {
    console.log("Serveur à l'écoute");       
})