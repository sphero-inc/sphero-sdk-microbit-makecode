# Sphero SDK

Greetings adventurous students, developers, hackers, and makers!  RVR is one of the best starting points into the vast world of robotics, and we’re here to help you get started with using our approachable development tools.

### Getting Started

Visit our [Getting Started](https://sdk.sphero.com/getting_started) to learn more about the ins-and-outs of working with RVR, including some important details on the getting started process.

### More information and documentation

Visit our [SDK website](https://sdk.sphero.com) to find more information about RVR, the SDK and the API!

### Where to get help

Visit our [community forum](https://community.sphero.com/c/advanced-programming) to get help, share your project, or help others!

### Staying up to date

Consider [signing up](https://sdk.sphero.com/sign-up) for our SDK email list to stay current on new features being released in our robot firmware as well as our SDKs, including new platform / language support.

# Sphero RVR SDK for micro:bit MakeCode

This module contains the set of commands that allow the micro:bit to communicate with the [Sphero RVR](https://www.sphero.com/rvr) robot using MakeCode.

The following commands are available in this module:

### Movement

* **drive**(*speed*, *heading*): drives the robot at the given speed with the given heading.
  * *speed* (int): an integer from 0-255
  * *heading* (int): an integer from 0-359 degrees (0 is forwards, 90 is to the right, 180 is backwards, and 270 is to the left)
  ```
  sphero.drive(80, 270)
  ```
* **stop**(*heading*): tells the robot to stop driving. The heading should be the robot's current heading.
  * *heading* (int): an integer from 0-359 (0 is forwards, 90 is to the right, 180 is backwards, and 270 is to the left)
  ```
  sphero.stop(90)
  ```
* **resetYaw**(): sets the robot's current yaw angle to zero.
  ```
  sphero.resetYaw()
  ```
* **setRawMotors**(*leftMode*, *leftSpeed*, *rightMode*, *rightSpeed*): sets the motors' modes and speeds individually. If a mode value outside of the 0-2 range is given, the mode will default to 0 (off).
  * *leftMode* (**RawMotorModes**): a member of the **RawMotorModes** class representing the drive mode for the left motor (OFF, FORWARD, BACKWARD)
  * *leftSpeed* (int): an integer from 0-255
  * *rightMode* (**RawMotorModes**): a member of the **RawMotorModes** class representing the drive mode for the right motor (OFF, FORWARD, BACKWARD)
  * *rightSpeed* (int): an integer from 0-255
  ```
  sphero.setRawMotors(sphero.RawMotorModes.forward, 100, sphero.RawMotorModes.forward, 100)
  ```

### Lights

* **setAllLeds**(*red*, *green*, *blue*): sets all of RVR's LEDs to the color represented by the given red, green, and blue values.
  * *red* (int): an integer from 0-255 indicating the desired red value
  * *green* (int): an integer from 0-255 indicating the desired green value
  * *blue* (int): an integer from 0-255 indicating the desired blue value
  ```
  sphero.setAllLeds(255, 255, 0)
  ```
* **setRgbLedByIndex**(*index*, *red*, *green*, *blue*): sets the indicated LED to the color represented by the given red, green, and blue values.
  * *index* (**LEDs**): a member of the **LEDs** class used to specify which LED is to be set
  * *red* (int): an integer from 0-255 indicating the desired red value
  * *green* (int): an integer from 0-255 indicating the desired green value
  * *blue* (int): an integer from 0-255 indicating the desired blue value
  ```
  sphero.setRgbLedByIndex(sphero.LEDs.leftStatus, 0, 0, 255)
  ```

### Power

* **sleep**(): puts the robot in a sleep state.
  ```
  sphero.sleep()
  ```
* **wake**(): wakes the robot from sleep.
  ```
  sphero.wake()
  ```

## Supported targets

* for PXT/microbit
