---
title: Altium designer tips and tricks
description: Tools, tips and tricks for PCB designing using Altium Designer
date: 2020-10-10
img: /imgs/blog/altium.png
lang: en
tocgenerate: true
publish: true
tags:
  - Electronics
  - PCB
  - STM32
---

![](/imgs/blog/altium.jpg)


## Libraries

I have several free component libraries that you can access via my github repo.<br>
https://github.com/HamedJafarzadeh/AltiumDesignerLibs

## Notes before starting a schematic

- [ ] Check for evaluation boards for each components that you havent use before
- [ ] Design your schematic identical to evaluation board schematic so it would be easy to review



## Schematic Design Final Check List
- [ ] Check Open Drain pins to have appropriate pull-up or pull-down resistors
- [ ] Check against STM32Cube Configuration
- [ ]  Make sure differential pairs have appropriate {NETName}\_P and {NETNAME}\_N
- [ ]  Estimate the power dissipation for Linear regulators
- [ ]   Check the Enable and CS pins active level, Active High  or Active
- [ ]   Check for 3.3v, +3.3v, 3v3, 3V3 power nets naming issues
- [ ]   Put a reference for the component datasheet
- [ ]   Check GND and VCC nets are okay and they are not used vice versa
- [ ]   Check if exposed pads should be connected to ground
- [ ] Did you choose the right part number for special capacitors and resistors ? 
  - [ ]   Consider the voltage and ESR of the capacitors
  - [ ]   Power and heat dissipation of the resistors
- [ ]   Is your circuit going to work in US ? In US the household electricity frequency is 60Hz .
- [ ]   Check amplifier inputs voltage that does not exceed the amplifier supply voltage

## PCB Design final checklist
- [ ] Thermal Pads
- [ ] Make sure that you don't have power loops in  your circuit
- [ ] Check the thermal pads for linear regulators



## Common PCB design problems



