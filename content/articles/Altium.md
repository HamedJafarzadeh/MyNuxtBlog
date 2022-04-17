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

## This is a live document and it will update frequently

Most of these tips are the result of Tyndall WSN Group design review meetings with direct collaboration of [Marco Belcastro](https://www.tyndall.ie/people/marco-belcastro/) and [Omid Talebi](https://www.tyndall.ie/people/omid-talebi/)

## External Materials

- USB Design guidelines [usb_guideline.fm (microchip.com)](http://ww1.microchip.com/downloads/en/AppNotes/doc7633.pdf)

- Differential pairs routing
  
  - [Altium 19 - USB Impedance Routing - YouTube](https://www.youtube.com/watch?v=-w6CbIG0hXk)
  
  - [How to Calculate Impedance for Single and Differential Transmission Line | Altium Designer - YouTube](https://www.youtube.com/watch?v=NvJZ4je22bw)

- Check trace length and widths for high current traces (anything more than 500ma) 

## Libraries

I have several free component libraries that you can access via my github repo.<br>
[GitHub - HamedJafarzadeh/AltiumDesignerLibs](https://github.com/HamedJafarzadeh/AltiumDesignerLibs)

Differrential length routing tutorial

## Notes before starting a schematic

- [ ] Check for evaluation boards for each components that you havent use before
- [ ] Design your schematic identical to evaluation board schematic so it would be easy to review

## Schematic Design Final Check List

- [ ] Check Open Drain pins to have appropriate pull-up or pull-down resistors

- [ ] Check microcontroller pins for voltages higher than 3.3v. Not all microcontroller pins are 5v tolerant. Specially when running as a alternative functions such as ADC, they are not 5v tolerant. Each pins that connected to a voltage higher than 3.3v should be checked individually against datasheet.

- [ ] Check VBat voltage of microcontroller to not exceed 3.7v  + 

- [ ] Make sure differential pairs have appropriate {NETName}\_P and {NETNAME}\_N +

- [ ] Check the Enable and CS pins active level, Active High  or Active low

- [ ] Check for 3.3v, +3.3v, 3v3, 3V3 power nets naming issues

- [ ] Put a reference for the component datasheet for easier review

- [ ] Check GND and VCC nets are okay and they are not used vice versa

- [ ] Check if exposed pads should be connected to ground + 

- [ ] Did you choose the right part number for special capacitors and resistors ? 

- [ ] Consider the voltage and ESR of the capacitors

- [ ] Power and heat dissipation of the resistors

- [ ] Is your circuit going to work in US ? In US the household electricity frequency is 60Hz, you should consider right filter to remove that from analog signals and power supply tracks. + 

- [ ] Do you have switching circuits or switching regulators ? like usb-powered circuit? have you considered eliminating the ripple voltage of it ?

- [ ] MISO / MOSI switched   +

- [ ] Check your micrcontroller pin assignment against STM32Cube Configuration after all edits to schematics finished

- [ ] if your circuit is running on battery, make sure that reduce the number of peripherals you used, for example in most cases you can use one I2C instead of having several I2C, or you can use one SPI with multiple CS pins, instead of several SPI's.

### OPAmps

- [ ] Check amplifier inputs voltage that does not exceed the amplifier supply voltage rail
- [ ] Do not supply opamps directly from switching regulators as it might introduce significant noises on the opamp's output.

## PCB Design final checklist

- [ ] Study the design rules again to see if there is anything temporary disabled or configured wrongly ? like expansion masks, component clearance, short circuits, minimum hole size, polygon connect

- [ ] Estimate the power dissipation for Linear regulators

- [ ] Are thermal pads wide and big enough ?

- [ ] No Test Point on highspeed differential pairs as they will act as antenna

- [ ] You should have a keepout 

- [ ] Make sure that you don't have power loops in  your circuit

- [ ] Check the thermal pads for linear regulators

- [ ] if you are using a good pcb manufacturer, put the solder mask expansion to zero for a better soldering and component placement

- [ ] Did you check Polygon pour over objects or over nets ?

- [ ] Check metal-based components for vias, there shouldn't be any exposed vias under the metal parts or vias should be tented

- [ ] All bypass capacitors are close to the components ?

- [ ] Do you have pin 1 indicator on all components ? [ For external assembly orders it is necessary ]

- [ ] Check text over pads/ test points

- [ ] if the test points are tented or they are also appeared in the top/bottom paste, it is wrong ! They don't need to be soldered. to change that, go to the test point library and enter a negative number for top paste

- [ ] Are there designators for components ? Are there guide arrows for the resistors where designator is far from the component it self

- [ ] if you are willing to do a lot of tests and you have on board smd jumpers, consider making them big enough so that they don't broke while you are soldering them

- [ ] Did you looked at the board in 3D mode with 3D components in place and removed ? Nothing coliding ? no weird pads exposed ?

- [ ] Do you have "region" in your design ? is it connected to a net ? if yes, then double check to make sure if it is connected ! Altium doesn't show any error if you don't connect a region to a choosen net

- [ ] Check QFN, BGA components pads are centered , Check from Datasheet recommended layout shape

## Common PCB design problems

## Common Circuit level problems

### There is ripple on output of an amplifier

- First, using an osciloscope measure the ripple frequency, write it down somewhere

- Second, check the input pins of amplifier, if the same ripple frequency is on the input pins, then you should find the root cause here

- Third, check the supply voltage, if you see the same ripple frequency on the supply voltage, then look at the `ripple on supply voltage` section

- Maybe the gain of amplifier was too high

- 
