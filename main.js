const SHA256 = require("crypto-js/sha256");

class Transaction{
    constructor(fromAddress, toAddress, amount, tip = 0){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.tip = tip;
    }
}

class Block{
    constructor( timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transacions) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined - HASH: " + this.hash + " - NONCE: " + this.nonce);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.reward = 2;
    }

    createGenesisBlock(){
        return new Block("01/01/2018", "This is a genesis block", "00000000");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    getbalance(address){
        let balance = 0;
        for(const block of this.chain){
            for(const transaction of block.transactions){
                if(transaction.fromAddress == address)
                    balance -= transaction.amount
                if(transaction.toAddress == address)
                    balance += transaction.amount
    
            }
        }
        return balance;
    }

    processPendingTransacions(rewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        let tipsTransactions = [];
        for(const transaction of block.transactions){
            tipsTransactions.push(new Transaction(transaction.fromAddress, rewardAddress, transaction.tip));
        }
        this.chain.push(block);

        this.pendingTransactions = [new Transaction(null, rewardAddress, this.reward)];
        this.pendingTransactions = this.pendingTransactions.concat(tipsTransactions);
    }

    createTransaction(transacion){
        this.pendingTransactions.push(transacion);
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if ( currentBlock.hash !== currentBlock.calculateHash())
                return false;
            
            if ( currentBlock.previousHash !== previousBlock.hash)
                return false;
        }
        return true;
    }
}

let fictiCoin = new Blockchain();

fictiCoin.createTransaction(new Transaction("Julian", "Diego", 3, 1));
fictiCoin.createTransaction(new Transaction("Julian", "Paito", 1));
fictiCoin.createTransaction(new Transaction("Cami", "Julian", 5, 0.5));
fictiCoin.createTransaction(new Transaction("Diego", "Cami", 1));



fictiCoin.processPendingTransacions("Diego");


console.log("Diego: " + fictiCoin.getbalance("Diego"));
console.log("Julian: " + fictiCoin.getbalance("Julian"));
console.log("Cami: " + fictiCoin.getbalance("Cami"));
console.log("Paito: " + fictiCoin.getbalance("Paito"));


fictiCoin.createTransaction(new Transaction("Cami", "Julian", 3));
fictiCoin.createTransaction(new Transaction("Paito", "Julian", 1));


fictiCoin.processPendingTransacions("Julian");

console.log("Diego: " + fictiCoin.getbalance("Diego"));
console.log("Julian: " + fictiCoin.getbalance("Julian"));
console.log("Cami: " + fictiCoin.getbalance("Cami"));
console.log("Paito: " + fictiCoin.getbalance("Paito"));

fictiCoin.processPendingTransacions("");

console.log("Diego: " + fictiCoin.getbalance("Diego"));
console.log("Julian: " + fictiCoin.getbalance("Julian"));
console.log("Cami: " + fictiCoin.getbalance("Cami"));
console.log("Paito: " + fictiCoin.getbalance("Paito"));