module.exports = function(RED) {
    function hx711Node(config){
	RED.nodes.createNode(this,config);
	var node = this;
	const HX711ADC = require('./HX711ADC.js');

	node.dout = parseInt(config.dout);
	node.sck  = parseInt(config.sck);
	node.gain = parseInt(config.gain);
	node.tare = parseInt(config.tare);
	node.initialized = false;

	// init the chip
	node.status({fill:"grey",shape:"ring",text:"INITIALISING HX711 .."});
	node.log("INITIALISING HX711 on BCM Pins DOUT: "+node.dout+" SCK: "+node.sck);
	node.hx711adc = new HX711ADC({DoutPinBCM:node.dout,SckPinBCM:node.sck,GAIN:node.gain});

	node.hx711adc.init();
	node.initialized = true;
	node.status({fill:"green",shape:"dot",text:node.type+" ready"});
	node.log("HX711 on BCM Pins DOUT: "+node.dout+" SCK: "+node.sck+" initialized ...");
	// trigger read
        node.on('input', function(msg) {
            msg.payload = node.hx711adc.singleRead();
	    node.debug("hx711: (dout:"+node.dout+",sck: "+node.sck+"): "+msg.payload);
            node.send(msg);
        });
    }
    RED.nodes.registerType("hx711",hx711Node);
}
