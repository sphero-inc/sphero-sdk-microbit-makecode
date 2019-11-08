basic.pause(2000)

sphero.drive(75, 0)
basic.pause(2000)

sphero.drive(75, 90)
basic.pause(2000)

sphero.stop(90)
sphero.resetYaw()
basic.pause(1000)

sphero.setRgbLedByIndex(
    sphero.LEDs.rightBrakelight,
    255,
    0,
    0
)
sphero.setRgbLedByIndex(
    sphero.LEDs.leftBrakelight,
    255,
    0,
    0
)

sphero.setRawMotors(
    sphero.RawMotorModes.backward,
    60,
    sphero.RawMotorModes.backward,
    60
)
basic.pause(2000)

sphero.setRawMotors(
    sphero.RawMotorModes.off,
    0,
    sphero.RawMotorModes.off,
    0
)
basic.pause(1000)

sphero.sleep()
basic.pause(5000)

sphero.wake()
basic.pause(2000)

sphero.setAllLeds(255, 255, 255)
