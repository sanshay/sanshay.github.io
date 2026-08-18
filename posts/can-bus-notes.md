---
title: "Practical CAN Bus debugging notes"
date: "2026-08-12"
description: "A compact checklist for debugging filters, IDs, payloads and bitrate mismatches on vehicle networks."
tags: ["CAN Bus", "Embedded"]
draft: false
---

# Practical CAN Bus debugging notes

CAN issues often look mysterious because several independent parameters must agree at once: bitrate, frame format, arbitration ID, mask, wiring and payload interpretation.

## Start with the physical layer

Before changing firmware, verify termination, CAN-H/CAN-L continuity and the expected idle voltage. A logic problem cannot compensate for a physical-layer fault.

## Confirm frame format

Extended 29-bit identifiers and standard 11-bit identifiers require different configuration. A correct numeric ID with the wrong frame type will still be missed.

## Log raw frames first

When debugging, print the raw identifier, DLC and every byte before adding higher-level decoding. This gives you a stable ground truth.

> Debug from the wire upward: physical layer → controller configuration → filters → protocol interpretation.
