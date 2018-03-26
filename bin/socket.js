/**********************************************************

		File name   : socket.js
		Description : Contains all the code for runing socket

DATE	    PROGRAMMER		COMMENT
19/03/18    rbnishant       INITIAL VERSION

**********************************************************/

var gIO = null;
var gEmitType = [];

module.exports = {

	/*
	 * FUNCTION NAME: start()
	 * Description: This function is used to start all of the listeners
	 * for the socket
	 * Input Parameters: io, socket
	 * Output Parameters: NA
	 */
	start: function(io, socket) {
		gIO = io;
		gEmitType.forEach(function (value){
			socket.on(value.type, value.fn);
		});
	},
	newBuyOrder: function(order) {
		gIO.emit("newBuyOrder", order);
	},
	newSellOrder: function(order) {
		gIO.emit("newSellOrder", order);
	},
	cancelOrder: function(orderID) {
		gIO.emit("cancelOrder", orderID);
	},
	broadcastOrderComplete: function(order) {
		gIO.emit("broadcastOrderComplete", order);
	},
	broadcastNewSplitOrder: function(order) {
		gIO.emit("broadcastNewSplitOrder", order);
	}
}