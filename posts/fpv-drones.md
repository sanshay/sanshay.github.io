---
title: "Why FPV drones became one of my favourite engineering hobbies"
date: "2026-08-16"
description: "What makes FPV drones so addictive to build, tune and fly — and what they taught me about embedded systems, RF links and real-time control."
tags: ["FPV", "Drones", "Embedded", "Engineering"]
draft: false
---

# Why FPV drones became one of my favourite engineering hobbies

FPV drones are one of those hobbies where software, electronics, mechanics and actual piloting all meet in one machine.

At first, the attraction is obvious: put on a pair of goggles and fly from the point of view of the aircraft. But once I started spending more time around FPV, I realised that the flying is only one part of what makes it interesting. A quadcopter is also a compact real-time embedded system that has to keep hundreds of things under control while reacting to the pilot almost instantly.

That combination is what kept me interested.

## A flying embedded system

A typical FPV quad may look simple from the outside: a carbon frame, four motors, a battery, a camera and some antennas. Underneath that, however, several systems are working together continuously.

The flight controller reads the gyroscope and accelerometer, runs the control loop, interprets pilot commands and adjusts motor outputs. The ESCs switch large currents through the motors. The radio receiver has to maintain a low-latency control link. The video transmitter sends a live camera feed back to the goggles. GPS, telemetry and other peripherals can add even more data to the system.

All of this has to happen while the aircraft is vibrating, changing direction rapidly and pulling significant current from a relatively small battery.

That makes FPV a very practical way to understand concepts that otherwise feel abstract on a bench.

## Building is as interesting as flying

One of my favourite things about FPV is that the aircraft is never really a finished product.

You can change the motors and get a completely different response. You can change the propellers and alter efficiency, grip and sound. A small change in filtering or PID tuning can change how locked-in the quad feels. Antenna placement can affect video quality. Even the way the wiring is routed can make a difference to noise and reliability.

A build normally becomes a cycle:

1. Assemble the hardware.
2. Check every electrical connection.
3. Configure the flight controller.
4. Test motor direction and receiver input.
5. Verify failsafes.
6. Fly carefully.
7. Review what does not feel right.
8. Tune, repair or improve it.

Then repeat.

That cycle feels very familiar if you already enjoy embedded development: build, test, log, debug and iterate.

## What FPV taught me about real-time control

FPV makes latency immediately visible.

On a normal software project, an extra few milliseconds may never be noticed. In a fast aircraft, latency exists directly between your hands and the movement of the machine. Radio protocol, packet rate, flight-controller loop timing, video latency and even pilot reaction time become part of one control chain.

It also gives you an intuitive understanding of feedback systems.

The pilot asks the aircraft to rotate. The flight controller measures what the aircraft actually did and continuously corrects the motors to bring the measured motion closer to the requested motion. That loop runs repeatedly at high speed.

Once you have seen a badly tuned quad oscillate and then watched the same aircraft become smooth after proper tuning, PID control stops being just something from a textbook.

## RF matters more than people expect

FPV also made me appreciate radio-frequency engineering.

A drone may have multiple wireless systems operating at the same time: control, video, telemetry and sometimes GPS reception. Antenna orientation, antenna polarization, output power, frequency selection and physical placement all matter.

More transmitter power does not automatically solve every problem. A clean RF setup with sensible antenna placement can often be more useful than simply increasing power.

The same is true for the control link. Range is important, but consistency and a predictable failsafe are even more important.

## Power systems are unforgiving

FPV drones can pull a surprising amount of power for their size.

That means the battery, connectors, ESCs, motor choice and propellers need to make sense together. A system that looks fine while sitting on the bench can behave very differently when all four motors demand current at the same time.

It is also a good lesson in why voltage sag matters. A battery may show a healthy voltage with almost no load and then drop significantly during a hard throttle input.

For me, this is one of the reasons FPV is such a useful engineering playground. Problems are physical and immediate. If something is inefficient, noisy, badly configured or unreliable, the aircraft usually tells you very quickly.

## The importance of failsafes

A flying machine forces you to think about failure modes.

What should happen if the radio link disappears? What if GPS is unavailable? What if a sensor becomes unreliable? What happens when the battery voltage falls too low?

These questions are useful far beyond drones.

Whenever I work on an embedded or vehicle system, I try to think in a similar way: what happens when the expected signal is missing, corrupted or outside its normal range? A reliable system is not one that only works when everything is perfect. It is one that fails in a controlled and predictable way.

## Why I still enjoy FPV

FPV combines several things I enjoy: electronics, embedded software, mechanical design, debugging and the satisfaction of controlling something you have actually built.

You can spend an evening soldering and configuring a quad, spend another day tuning it, and then finally take it outside and experience the result through the goggles.

There are not many engineering hobbies where the feedback loop between design and experience is that immediate.

And there is always another improvement to make.
