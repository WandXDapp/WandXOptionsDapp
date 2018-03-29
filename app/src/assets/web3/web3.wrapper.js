var web3Functions = new function(){
    this.checkWeb3 = function(){
        if(typeof web3 === 'undefined'){
            return false;
        }
        else{
            return true;
        }            
    };
    this.initializeWeb3 = function(){
        if(typeof web3 !== 'undefined')
             return web3 = new Web3(web3.currentProvider);
    };
}