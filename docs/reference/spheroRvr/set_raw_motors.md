# set_raw_motors

```sig
spheroRvr.set_raw_motors(left_mode, left_speed, right_mode, right_speed)
```

## Parameters

* **left_mode**: The mode of the left motor. Use RawMotorModes enum!
* **left_speed**: The speed of the left motor.
* **right_mode**: The mode of the right motor. Use RawMotorModes enum!
* **righ_speed**: The speed of the right motor.

## Example

```blocks
spheroRvr.set_raw_motors(RawMotorModes.Backward, 40, RawMotorModes.Backward, 40);
```

## See also

[drive](/reference/spheroRvr/drive.md), [stop](/reference/spheroRvr/stop.md)

```package
spheroRvr
```
