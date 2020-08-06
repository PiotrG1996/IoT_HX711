# node-red-contrib-hx711

A node-red custom node wrapper for the nodejs HX711 ADC package. It was tested using a Pi 3 and might work on other platforms with node-RED. The package provides a single custom node **hx711** that can be used directly in your flow.

## Installation

Under your node-red (typically `$HOME/.node-red`) working directory.

`npm install node-red-contrib-hx711`

Node palette can be used as well to install the node.

After restarting node-red the "hx711" node should be available in "input" category.

## Prerequisites

Wire your ADCs DOUT and SCK with free pins on your pi. Only four wires are needed. Two for power (VCC & GND) and two for bit-banging. The numbering follows the BCM numbering of the pins.

## Usage

### Configuration & deployment

After installation place your hx771 node in any of your flow and configure the following parameters:

1. **Name:** Select the name of your node for easy identification.
2. **dout:** Select the DOUT pin (BCM) on your Pi.
3. **sck:** Select the SCK pin (BCM) on your Pi.
4. **gain:** Select signal amplification gain, 128 and 64 uses port A of the chip, 32 uses port B
5. **tare:** Select offset value for tare (optional).

### Reading Sensor Data

As in other node-red nodes the actual measurement of hx711 data require that an input msg arrive to the node. The input called **Trigger** will start the reading of the hx711 data will send the data in the node's output.

The **output** will have the following format:

```
msg = {
  _msgid: <node-red msg_id>,
  payload: {
  	   value of hx711 ADC
  }
}

```

## Notes

This node has been tested on Raspberry Pi 3, running recent versions of node-red.

hx711 has been tested using different breakout from cheap providers. Original Adafruit's sensor is not required.
