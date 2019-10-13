# Sphero RVR SDK for micro:bit MakeCode

This module contains the set of commands that allow the micro:bit to communicate with the RVR using MakeCode.

The following commands are available in this module:

### Movement

* **drive**(*speed*, *heading*): drives the robot at the given speed with the given heading.
  * *speed* (int): an integer from 0-255
  * *heading* (int): an integer from 0-359 degrees (0 is forwards, 90 is to the right, 180 is backwards, and 270 is to the left)
* **stop**(*heading*): tells the robot to stop driving. The heading should be the robot's current heading.
  * *heading* (int): an integer from 0-359 (0 is forwards, 90 is to the right, 180 is backwards, and 270 is to the left)
* **resetYaw**(): sets the robot's current yaw angle to zero.
* **setRawMotors**(*leftMode*, *leftSpeed*, *rightMode*, *rightSpeed*): sets the motors' modes and speeds individually. If a mode value outside of the 0-2 range is given, the mode will default to 0 (off).
  * *leftMode* (**RawMotorModes**): a member of the **RawMotorModes** class representing the drive mode for the left motor (OFF, FORWARD, BACKWARD)
  * *leftSpeed* (int): an integer from 0-255
  * *rightMode* (**RawMotorModes**): a member of the **RawMotorModes** class representing the drive mode for the right motor (OFF, FORWARD, BACKWARD)
  * *rightSpeed* (int): an integer from 0-255

### Lights

* **setAllLeds**(*red*, *green*, *blue*): sets all of RVR's LEDs to the color represented by the given red, green, and blue values.
  * *red* (int): an integer from 0-255 indicating the desired red value
  * *green* (int): an integer from 0-255 indicating the desired green value
  * *blue* (int): an integer from 0-255 indicating the desired blue value
* **setRgbLedByIndex**(*index*, *red*, *green*, *blue*): sets the indicated LED to the color represented by the given red, green, and blue values.
  * *index* (**LEDs**): a member of the **LEDs** class used to specify which LED is to be set
  * *red* (int): an integer from 0-255 indicating the desired red value
  * *green* (int): an integer from 0-255 indicating the desired green value
  * *blue* (int): an integer from 0-255 indicating the desired blue value

### Power

* **sleep**(): puts the robot in a sleep state.
* **wake**(): wakes the robot from sleep.


## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)
