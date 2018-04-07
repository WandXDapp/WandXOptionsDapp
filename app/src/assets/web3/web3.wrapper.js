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
	
	this.initializeWeb3WithInfura = function(){
		// return new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws'));
		let web3Infura = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws'));
		return web3Infura;
	}
}