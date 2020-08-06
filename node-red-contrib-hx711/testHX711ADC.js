const HX711ADC = require('./HX711ADC.js');

const sensorOptions = {
    DoutPinBCM  : 5,
    SckPinBCM   : 6,
    GAIN        : 128,
    TARE        : 0.0
}

const hx711 = new HX711ADC(sensorOptions);

function readSensorTest(){
    let i,j;
    var count;
    
    hx711.init();
    
    for (j=0;j<20;j++)
    {
	count = hx711.singleRead();
	console.log('count: '+count+'tare: '+hx711.TARE);
    }    
}

readSensorTest();
