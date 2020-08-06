'use strict';

class HX711ADC{
    constructor(options){
	const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
	this.DoutPinBCM = (options && options.hasOwnProperty('DoutPinBCM')) ? options.DoutPinBCM : 5;
	this.SckPinBCM = (options && options.hasOwnProperty('SckPinBCM')) ? options.SckPinBCM : 6;
	this.GAIN = (options && options.hasOwnProperty('GAIN')) ? options.GAIN : 128;
	this.TARE = (options && options.hasOwnProperty('TARE')) ? options.TARE : 0.0;
	this.DOUT = new Gpio(this.DoutPinBCM, 'in');     //use GPIO pin 5 (BCM) as input
	this.SCK  = new Gpio(this.SckPinBCM, 'out');     //use GPIO pin 6 (BCM) as ouput
    }

    wait1ms() {
	return new Promise(resolve => {
	    setTimeout(() => {
		resolve('resolved');
	    }, 1);
	});
    }

    waitms(sec) {
	return new Promise(resolve => {
	    setTimeout(() => {
		resolve('resolved');
	    }, sec);
	});
    }

    count2Decimal(data){
	let value;
	if( (data & (1 << 23)) !=0)  // negative value
	    value = data | ~((1 << 24)-1);
	else
	    value = data;
	return value;
    }

    
    sensorReady(){
	return new Promise(resolve => {
	while(this.DOUT.readSync()==1);      // wait for HX711 to be ready
	});
    }

    readCount(){
	let gcount = 1;
	var COUNT  = new Uint32Array(1);
	let i; 
    
	if(this.GAIN == 128)     gcount = 1; // Channel A Gain 128 (default as defined) 
	else if(this.GAIN == 64) gcount = 3; // Channel A Gain 64  
	else if(this.GAIN == 32) gcount = 2; // Channel B Gain 32  

	//this.sensorReady();                  // wait for HX711 to be ready
	//while(this.DOUT.readSync()==1) this.wait1ms();
	while(this.DOUT.readSync()==1);
	
	//console.log('GAIN '+gain+' gcount '+gcount);
	COUNT[0] = 0;
	this.SCK.writeSync(0);               // Signal unit that you wish to read 

	for(i=0;i<24;i++){              // read 24 bits 
	    this.SCK.writeSync(1);
	    COUNT[0] = COUNT[0] << 1;
	    if(this.DOUT.readSync()==1) COUNT[0]++;
	    this.SCK.writeSync(0);
	}

	for(i=0;i<gcount;i++)           // select the gain for the next read
	{
	    this.SCK.writeSync(1);
	    this.SCK.writeSync(0);
	}

	// console.log('readCount : '+COUNT[0]);
	// COUNT[0] = COUNT[0]^0X800000;
	return (COUNT[0]);
    }
    
    readAverage(times){
	let avg=0.0;
	let i;
	for(i=0;i<times;i++){
	    avg = avg + this.count2Decimal(this.readCount());
	    this.waitms(20);
	}
	avg = avg/times;
	return avg;
    }

    tare(){
	this.waitms(100);
	this.TARE = this.readAverage(20);
    }

    init(){
	// init by performing read and tare
	this.waitms(100);
	this.tare();
	this.TARE = 0.0;
    }
    
    setGain(gain){
	this.GAIN = gain;
    }

    setTare(tare){
	this.TARE = tare; 
    }

    singleRead(){
	return (this.count2Decimal(this.readCount()) - this.TARE);
    }

    smoothRead(){
	let j;
	let avg = 0.0; 
	for(j=0;j<4;j++)
	    avg +=this.count2Decimal(this.readCount()) - this.TARE;
	avg /= 4;
	return (avg);
    }
        
}

module.exports = HX711ADC;

