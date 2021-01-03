---
title: STM32 tips and tricks
description: In this post, we will study about how to use GUI displays for STM32
img: /imgs/blog/noimagepost.jpg
lang: en
publish: true
tocgenerate: true
tags:
  - STM32
  - Electronics
---
## External Materials
- [STM32CubeMX CPP IDE CPP Programming](https://www.youtube.com/watch?v=9syJpWDqj88&list=PLZW8FgseiOipQHuCzm-60epW10gPDLEu8&index=2&ab_channel=HamedJafarzadeh)
- [stm32tt - Similiar tips and tricks pages](https://stm32.agg.io/)
- **Persian** youtube tutorials for STM32Cube Projects
	- [STM32Cube ADC and LCD initialization](https://www.youtube.com/watch?v=OM55hZHMODE&list=PLZW8FgseiOipQHuCzm-60epW10gPDLEu8&index=1&ab_channel=HamedJafarzadeh)
	- [STM32Cube UART and External Interrupt](https://www.youtube.com/watch?v=eajPqLi8Lek&list=PLZW8FgseiOipQHuCzm-60epW10gPDLEu8&index=3&ab_channel=HamedJafarzadeh)
	- [STM32Cube Timers and clocks initialization - Debugging Tools](https://www.youtube.com/watch?v=w4gU3XbaeBQ&list=PLZW8FgseiOipQHuCzm-60epW10gPDLEu8&index=4&ab_channel=HamedJafarzadeh)
	- [STM32Cube PWM and I2C](https://www.youtube.com/watch?v=gjlF0ZNPGOA&list=PLZW8FgseiOipQHuCzm-60epW10gPDLEu8&index=6&ab_channel=HamedJafarzadeh)
	- [STM32Cube SPI and HAL Tips](https://www.youtube.com/watch?v=hzhJiOXLBg4&list=PLZW8FgseiOipQHuCzm-60epW10gPDLEu8&index=6&ab_channel=HamedJafarzadeh)
	- [STM Studio Tutorial](https://www.youtube.com/watch?v=Zfi_rxZ2TrA&list=PLZW8FgseiOipQHuCzm-60epW10gPDLEu8&index=7&ab_channel=HamedJafarzadeh)

## Enable printf to Serial or ITM
### Quick steps
- in your `main.c`, add relevant function between `User Code x ` tags
	- Redirect to UART
    ```c
    int __io_putchar(int ch) {
        HAL_UART_Transmit(&huart1, &ch, 1, 10);
    }
    ```
    - Redirect to ITM
    ```c
    int __io_putchar(int ch) {
        ITM_SendChar(ch);
    }
    ```
### Detailed explanation
In STM32Cube projects, STDIO functions are redirected to `_write` function. You can find this function in `syscall.c` file in default STM32CubeMX projects. Mine look like this :

```c
__attribute__((weak)) int _write(int file, char *ptr, int len)
{
	int DataIdx;

	for (DataIdx = 0; DataIdx < len; DataIdx++)
	{
		__io_putchar(*ptr++);
	}
	return len;
}
```

In this function, each character finally passed to `__io_putchar` function. if you take a look at the definition of this function, you will find such definition in top of your `syscall.c` file. As you can see, it is `extern` and also `weak` which means that it can be defined outside of `syscall.c`, for example in `main.c`, which we did in quick steps section.

```c
extern int __io_putchar(int ch) __attribute__((weak));
```

## STM32 Evaluation Boards with display

- [STM32H743I-EVAL2](https://ie.farnell.com/stmicroelectronics/stm32h743i-eval2/evaluation-board-32bit-arm-cortex/dp/3021474)  - 432 euro
- [STM32429I-EVAL1](https://ie.farnell.com/stmicroelectronics/stm32429i-eval1/eval-brd-stm32f42x-mcus/dp/2365196)  -  348 euro
- [STM32F7508-DK](https://ie.farnell.com/stmicroelectronics/stm32f7508-dk/discovery-kit-32bit-arm-cortex/dp/2987048)   -  51.40 euro
- [STM32F769I-DISCO](https://ie.farnell.com/stmicroelectronics/stm32f769i-disco/discovery-board-mcu/dp/2546570) - 82 euro

