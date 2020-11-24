# Introduction

This project contains a web application based on Node-Red to measure force and tourqe using HX711 sensor. Special hardware attached on the top of Raspberry Pi enables proper signal communication betweeen HX711 and RPI. There are 2 possibilities of communication:

1. SSH protocol (without graphical user interface)
2. VNC connection (with graphical user interface)

At the end of the project, Raspberry Pi should work as an individual access point and execute Node-RED on boot. The description of this step is shown further in the project. Finally, this project provides a full measurement of a force and a moment of a force storing all measured data in the files.

This project contains a general description of mechanical parts, GPIO definition, and a
scheme presenting step by step how to calibrate individual forces. A full explanation of basic calculus and necessary blocks in Node-RED is provided as well. A Shortcode overview and designed
graphical user interface in a web application is presented at the end o readme.

## Project guidelines:

* Define GPIO ( onoff node module is required)
* Calibrate raw data from sensors
* Calculate for all sensors: force and moment of a force
* Implement graphical interface in Node-RED
* Documentation

## Sensor specification:
* Supply voltage: 2.6 V to 5.5 V
* Number of channels: 2
* ADC converter: 24-bit
* Preamplifier: low noise 32 / 64 / 128
* Updated frequency: 10 Hz / 80 Hz
* Pins: openings for goldpin connectors - 2.54 mm 
* Operating temperature: -20 °C to 85 °C
* Module dimensions: 33 x 20 mm
  
</br>

<p align="center">
  <img width="460" height="300" src="img/module.png">
</p>

<p align="center">
Figure 1. HX711 sensor
</p>
</br>
                        

| PIN |             DESCRIPTION             |
| --- | :---------------------------------: |
| VCC |  Supply voltage from 2.6V to 5.5V   |
| DAT | Data line of the communication bus  |
| CLK | Clock line of the communication bus |
| GND |      The ground of the system       |
| E+  |                                     |
| E-  |                                     |
| A-  |          Lines to connect           |
| A+  |        the strain-gauge beam        |
| B-  |                                     |
| B+  |                                     |




A mechanical case presented above protects this sensor against damage and provides a lever to measure a force and a moment of force. There are six sensors connected to the expansion hat. This half-bridge load cell can measure up to 50kg depending on a tensometric beam.

<p align="center">
  <img width="660" height="300" src="img/lever.png">
</p>
<p align="center">
Figure 2. Mechanical cover part with lever
</p>
</br>

Raspberry Pi is a miniaturized computer, works as an embedded system and is applied to execute programs in Node-Red. Special attached I/O expansion hat enables to read data from the sensor in real-time. 

</br>

## Definition of GPIOs:

<p align="center">
  <img width="860" height="400" src="img/GPIO.png">
</p>
<p align="center">
Figure 3. Raspberry Pi GPIO
</p>
</br>

1. __Name:__ 	- select the name of your node for easy identification.
2. __dout:__ - select the DOUT pin (BCM) on your Pi.
3. __sck:__  - select the SCK pin (BCM) on your Pi.
4. __gain:__ - select signal amplification gain, 128 and 64 uses port A of the chip, 32 uses port B
5. __tare:__ - select offset value for tare (optional).

</br>

Recording to the difference between RPi pins order and Node-RED, in selected input “hx711”, all properties were changed and assigned to the following  BCM numbers:

| Sensor |  SCK  | dout |
| ------ | :---: | ---: |
| 1      |  17   |    4 |
| 2      |  22   |   27 |
| 3      |   9   |   10 |
| 4      |   5   |   11 |
| 5      |  13   |    6 |
| 6      |  26   |   19 |

</br>

## Force calibration

<p align="center">
  <img  src="img/results.png">
</p>
<p align="center">
Figure 4. Calibration results
</p>
</br>

To achieve the correct calibration of all sensors, four measurements were done with the following weights: 20g, 50g, 100g, 200g, and one without. Based on the results of signal values, the graph with the table was created. All average values from the individual sensors inserted into the formula shown beneath. Every linearized function was calculated by the following mathematical formula:
The linearized function (1) represents an equation of a straight defined by a calibrated sensor. At the moment variables, a and b are unknown.

<p align="center">
  <img width="560" height="600" src="img/calculations.png">
</p>

After calibration the next step is to limit a force in a range from 0 to 2 N and
round the result value to the hundredth fraction. Full code is located in a node
called <b><i>ConvertToForce</i></b>.

<p align="center">
  <img width="300" height="100" src="img/functionblock.png">
</p>

A JavaScript function block allows writing a code in a javascript programming
language. A JavaScript object is kept in a message called msg. A node called
ConvertToForce contains a complete function to get the current time, calculate force, and
moment of a force. The message is sent in an object of the following structure:
```json
{
"time": "20:55:59", 
"MyForce": 0.05, 
"Moment": 0.25
}
```
<p align="center">
  <img width="300" height="100" src="img/jsonblock.png">
</p>
JSON ( JavaScript Object Notation) is a standard way of representing a JavaScript
object as a String. It is commonly used by web APIs to return data. The main idea
of the JSON format is to represent and store data that is easily readable.

</br>

<p align="center">
  <img width="200" height="100" src="img/fileblock.png">
</p>

This block is responsible for saving all <b><i>msg.payload</i></b> into the specified file path.
The filename should include the full path to the folder in which all data is stored. If the file doesn’t exist, then will be automatically created:
```bash
/<path>/.node-red/node_modules/node-red-contrib-hx711/Data/Sensor_I.log
```
The path must be changed.

### Example of the application in the Node-RED flow:

<p align="center">
  <img width="500" height="250" src="img/file_example.png">
</p>
<p align="center">
Figure 5. Example of file appending
</p>
</br>

<p align="center">
  <img width="300" height="100" src="img/debugblock.png">
</p>

This block helps in debugging. This tool is useful whenever something does not work
properly. An example of use is shown below.

<p align="center">
  <img width="400" height="300" src="img/example_debug.png">
</p>
<p align="center">
Figure 6. Example of the object usage
</p>
</br>

<p align="center">
  <img width="300" height="120" src="img/buttonblock.png">
</p>

A button element is triggered by an inject input and allows to delete all stored
data from sensors in separate files. Node <b><i>ConvertToForce</b></i> contains the following code:

```javascript
var date = new Date();  // get actual date
var hours = date.getHours();    // get hours
var minutes = date.getMinutes();    // get minutes
var seconds = date.getSeconds();    // get seconds

if(hours < 10) hours = "0" + hours; // fix time representation
if(minutes < 10) minutes = "0" + minutes;
if(seconds < 10) seconds = "0" + seconds;
var time = hours + ":" + minutes + ":" + seconds;   // store actual time in a variable
var raw = msg.payload;  // assign a sensor value to variable raw

var newforce = 9.81*(raw + 62543)/(2884*1000); // calculate force
var Force = Math.round(newforce*10)/100;    // round force value to 0.01

// Define coordinates (distance)
var x0 = 10;
var y0 = 10;
var x1 = 1;
var y1 = 1;

xdifference = x1 - x0;
ydifference = y1 - y0;

Math.pow(x0, 2)
var Moment = Force * (Math.sqrt(Math.pow(xdifference, 2) + Math.pow(ydifference, 2)));
payload = {time, Force, Moment}

// create an object
msg.payload = payload;

// add object to the message
return msg;
```
<p align="center">
  <img width="300" height="120" src="img/functionblock1.png">
</p>

A node called <b><i>SendOnlyMoment</b></i> provides data type conversion and sends
only the value of its object property “Moment”. Included code looks like
one presented below:

```javascript
var nmsg = msg.payload;
payload = mymoment;
var mymoment = msg.payload.Moment;
msg.payload = mymoment;
return msg;
```
<p align="center">
  <img width="300" height="120" src="img/functionblock2.png">
</p>

Analogically <b><i>SendOnlyForce</b></i> sends only the value of a Force.

```javascript
var nmsg = msg.payload;
payload = myforce;
var myforce = msg.payload.Force;
msg.payload = myforce;
return msg;
```
</br></br></br>



## Moment of a force

The moment of a force is the tendency of some forces to cause rotation. In this
project rotating propeller causes a change of a moment whenever the direction of the screw is changed. A schematic idea of the sensors' position is presented below. The
distance between two points must be defined in the node <b><i>ConvertTheForce</b></i> as well
as an angle of force depending on an angular position of a screw.
The moment of a force is calculated according to the following equation:

 <p align="center">
  <img width="500" height="150" src="img/equation.png">
</p>
</br>

# Graphical User Interface

The GUI is presented in a form of a web application that runs as a client (in a browser),
the connection is provided by WiFi from RaspberryPi that works as an access point.

<p align="center">
  <img width="300" height="100" src="img/moment.png">
</p>

This node adds a guage type widget to the user interface. The <b><i>msg.payload</b></i> is
searched for a numeric value and displayed as a regular gauge, donut, compass or
wave. The label can also be set by a message property by setting the field to the
name of the property, for example <b><i>{{msg.topic}}</b></i>.

<p align="center">
  <img width="300" height="100" src="img/force.png">
</p>

The same function according to the Force is provided by a differently called node.
A gauge widget is shown below.

<p align="center">
  <img width="800" height="250" src="img/UI.png">
</p>
<p align="center">
Figure 7. Fragment of user interface - gauge widget
</p>
</br>

There are two different types of guage to separate shown in live time values of a
force and the moment of a force. The value is sent every second and shown above
the label with a defined unit.

<p align="center">
  <img width="350" height="120" src="img/gaugeblock.png">
</p>


This chart plots the input values on a diagram. In this case, all values from the sensor appear on a linear chart. Axes with time and the range of value can be changed as
well. This can be either a bar or pie chart. Each input msg.payload value is converted
to a number. If the conversion fails, the message is ignored. More information
about chart properties is well described in a node help section. A button under
both charts is used to delete all data from saved files. It doesn’t affect the live time
diagram view. There is an image of overviewed charts below.


<p align="center">
  <img width="800" height="1000" src="img/graph.png">
</p>
<p align="center">
Figure 8. Fragment of user interface - live graph
</p>
</br>

Node-RED makes it easy to save, share and move flows between computers using
the export and import feature. Flows are exported as a JSON file and imported from
a JSON file. Flows can be exported in parts or as an entire flow. To copy the flow
click <b><i>Menu -> export -> clipboard</b></i>. There is an option to download the file or copy
it to the clipboard. The full version of the project is attached as in a file flows.json.
The result of this flow is presented below.

<p align="center">
  <img width="800" height="800" src="img/flow.png">
</p>
<p align="center">
Figure 9. Complete flow saved as <i>flows.json</i>
</p>
</br>

# Raspberry Pi configuration

There is also a possibility to set up RaspberryPi as an access point and run Node-
RED on reboot. This is essential to run a program on Raspberry automatically.

## Step 1: Install and update Raspbian

```
sudo apt-get update
sudo apt-get upgrade
```
## Step 2: Install hostapd and dnsmasq
```
sudo apt-get install hostapd
sudo apt-get install dnsmasq
```
Stop running the program while setting the configuration:
```
sudo systemctl stop hostapd
sudo systemctl stop dnsmasq
```

## Step 3: Configure a static IP for the wlan0 interface
```
sudo nano /etc/dhcpcd.conf
```
 Add lines at the end of the file:
```
interface wlan0
static ip_address=192.168.0.10/24
denyinterfaces eth0
denyinterfaces wlan0
```

## Step 4: Configure the DHCP server (dnsmasq)
```
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig
sudo nano /etc/dnsmasq.conf
```
 Type lines into the file:
 ```
interface=wlan0
dhcp-range=192.168.0.11,192.168.0.30,255.255.255.0,24h
```

# Step 5: Configure the access point host software (hostapd)
```
sudo nano /etc/hostapd/hostapd.conf
```
 Define wireless configuration and change SSID with password:
 ```
interface=wlan0
bridge=br0
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
ssid=NETWORK
wpa_passphrase=PASSWORD
```
Show the system the location of the configuration file:
```
sudo nano /etc/default/hostapd
```
Add this line at the end of the file:
```
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```

# Step 6: Set up traffic forwarding
```
sudo nano /etc/sysctl.conf
```
delete # symbol from #net.ipv4.ip_forward=1

# Step 7: Add a new iptables rule
```
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"
```
To run the configuration on boot edit /etc/rc.local and add the following line just above the line exit 0:
```
iptables-restore < /etc/iptables.ipv4.nat
```
It is possible to execute Node-RED command as well:
1. Create a python file (extension .py) with the following code:
```
import os
os.system('node-red-start')
```
Don’t forget to make it executable: chmod +x <fileName>
2. Add line to /etc/rc.loca before exit 0:
```
sudo python /home/pi/sample.sh &
```
# Step 8: Enable internet connection
```
sudo apt-get install bridge-utils
```
Add new bridge:
```
sudo brctl addbr br0
sudo brctl addif br0 eth0
```
Edit interface:
```
sudo nano /etc/network/interfaces
```
 Add following lines:
 ```
auto br0
iface br0 inet manual
bridge_ports eth0 wlan0
```

# Step 9: Reboot
```
sudo reboot
```
## Conclusions

Node-RED is a very useful tool for integrating IoT devices in applications such as home
automation or rapid prototyping. It is based on a very efficient technology – Node.js and benefits from the one of the top popular language JavaScript. Process in creating web applications can be achieved much faster because of already existing node blocks. All need to be done is its configuration. Most of the modules can be changed using HTML with CSS as well.
JSON format brings in easy-to-read metadata and is commonly used together with
other modern web technologies. Flow-based programming makes programming
easier but it has also limits in its functionality. It is also possible to contribute your own
Node-RED module to extend functionality of sensors and provide new open source software for the
community.
