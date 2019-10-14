# setRawMotors

```sig
spheroRvr.setRawMotors(leftMode, leftSpeed, rightMode, rightSpeed)
```

## Parameters

* **leftMode**: The mode of the left motor. Use `RawMotorModes` enum!
* **leftSpeed**: The speed of the left motor.
* **rightMode**: The mode of the right motor. Use `RawMotorModes` enum!
* **rightSpeed**: The speed of the right motor.

## Example

```blocks
spheroRvr.setRawMotors(RawMotorModes.backward, 40, RawMotorModes.backward, 40);
```

## See also

[drive](/reference/spheroRvr/drive.md), [stop](/reference/spheroRvr/stop.md), [resetYaw](/reference/spheroRvr/resetYaw.md)

```package
spheroRvr
```
