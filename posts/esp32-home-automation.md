---
title: "Building my own home automation system with ESP32"
date: "2026-08-14"
description: "How I approached a local-first ESP32 home automation system with Wi-Fi devices, sensors, relays, MQTT and a simple dashboard."
tags: ["ESP32", "Home Automation", "IoT", "MQTT"]
draft: false
---

# Building my own home automation system with ESP32

Commercial smart-home products are convenient, but building your own home automation system is much more interesting because you get to decide how every part works.

For my own setup, I wanted the architecture to stay simple: small ESP32-based nodes around the house, Wi-Fi for communication and a central interface for monitoring and control. Most importantly, I wanted the system to remain useful without depending completely on somebody else's cloud service.

The ESP32 is a natural fit for this kind of project. It is inexpensive, has Wi-Fi and Bluetooth built in, offers enough GPIO for sensors and controls, and has a huge ecosystem of libraries and development tools.

## The basic architecture

I think of the system in three layers.

### 1. Device layer

ESP32 nodes are installed wherever sensing or control is required. Depending on the room or application, a node can handle things such as:

- Lighting control
- Relay outputs
- Temperature and humidity sensing
- Motion or presence detection
- Door or window sensing
- Energy-monitoring inputs
- Status LEDs
- Physical switches

The ESP32 handles the immediate local logic and communicates with the rest of the system over Wi-Fi.

### 2. Messaging layer

Instead of making every device communicate directly with every other device, I prefer a message-based architecture.

MQTT works very well for this because the devices can publish their state and subscribe to commands without needing to know much about each other.

For example, a room controller might publish:

```text
home/bedroom/temperature
home/bedroom/light/state
home/bedroom/motion
```

And listen for commands such as:

```text
home/bedroom/light/set
```

That separation makes it much easier to add another dashboard, automation rule or sensor later.

## Keeping local control

One design decision I consider important is that basic functions should not become unusable if the internet connection goes down.

If a wall switch controls a light, pressing that switch should still control the light even if the dashboard or external internet connection is unavailable.

The network layer should add intelligence, monitoring and remote control; it should not remove the reliability of a normal physical control.

So the ESP32 can contain simple local behaviour while MQTT handles coordination with the wider system.

## A simple ESP32 MQTT pattern

A very simplified device loop might look like this:

```cpp
#include <WiFi.h>
#include <PubSubClient.h>

WiFiClient wifiClient;
PubSubClient mqtt(wifiClient);

const int relayPin = 26;

void callback(char* topic, byte* payload, unsigned int length) {
  String command;

  for (unsigned int i = 0; i < length; i++) {
    command += (char)payload[i];
  }

  if (String(topic) == "home/room/light/set") {
    digitalWrite(relayPin, command == "ON" ? HIGH : LOW);
    mqtt.publish("home/room/light/state", command.c_str(), true);
  }
}

void setup() {
  pinMode(relayPin, OUTPUT);

  // Connect Wi-Fi here.
  // Configure the MQTT broker here.

  mqtt.setCallback(callback);
}

void loop() {
  // Reconnect Wi-Fi/MQTT when necessary.
  mqtt.loop();
}
```

A production version needs proper reconnect logic, authentication, safe default states and more defensive handling, but the basic pattern stays surprisingly small.

## Giving every device a clear identity

Once you have more than a few nodes, naming becomes important.

I prefer a predictable topic structure such as:

```text
home/<room>/<device>/<property>
```

That makes the system easy to inspect and debug.

For example:

```text
home/livingroom/ac/temperature
home/livingroom/light1/state
home/kitchen/motion/state
home/entrance/door/state
```

The same idea applies to device IDs and hostnames. Good naming saves a lot of time later.

## Building the dashboard

The dashboard does not need to be complicated.

For me, the useful information is the current state of the house rather than a screen full of decorative graphs. A simple dashboard can show:

- Which lights are on
- Room temperatures
- Motion or occupancy state
- Open doors or windows
- Device connectivity
- Basic energy information
- Manual controls

The key is that the UI should be faster than walking through several menus in a commercial smart-home app.

Home automation should remove friction, not create another interface that needs constant management.

## Automations are where it becomes useful

Once every sensor and actuator is available through the same system, useful rules become easy to create.

For example:

```text
IF motion is detected after sunset
AND the room light is off
THEN turn the light on.
```

Or:

```text
IF no motion has been detected for a configured period
THEN switch selected loads off.
```

Or even:

```text
IF room temperature rises above a threshold
THEN notify the dashboard or trigger an HVAC action.
```

The interesting part is that these rules can combine devices that were originally built independently.

## Reliability matters more than features

An IoT prototype can look impressive when it works once. A home automation system has to work every day.

That changes what matters.

I care about:

- Automatic Wi-Fi reconnection
- MQTT reconnection
- Watchdog recovery
- Safe relay states after reboot
- Debounced physical inputs
- Clear device status reporting
- Retained MQTT state where appropriate
- Reliable power supplies
- Proper isolation when controlling mains equipment

The last point is especially important. ESP32 GPIO operates at low voltage, while household electrical loads can involve dangerous mains voltages. Any mains switching should use correctly rated and isolated hardware and should be installed with appropriate electrical safety practices.

## What I like about building it myself

The biggest advantage is not cost. It is control.

I can decide what data exists, where it goes, how devices communicate and what happens when something fails. I can also add a new ESP32 node for a very specific problem without waiting for a commercial product to exist.

It turns the house into a practical IoT laboratory.

And because the architecture is based on simple building blocks — ESP32, Wi-Fi, MQTT, sensors and actuators — the same ideas can scale from one automated light to a much larger monitoring and control system.

That is exactly what makes the project fun: it is never really finished. There is always another sensor to add, another automation to improve and another small piece of software that can make the physical environment behave a little more intelligently.
