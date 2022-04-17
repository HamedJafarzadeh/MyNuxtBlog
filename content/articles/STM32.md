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

## 

## Programmer and Programming issues

#### It is possible to connect to microcontroller, but impossible to program with `Internal command error`

- Check VCC Pin of programmer to see if it is connected properly to your microcontroller VCC and they both are connected to board VCC

## ADC / Analog to digital converter tips

- I suggest using the following function to reduce noise on ADC readings
  
  ```c
  HAL_ADCEx_Calibration_Start(&hadc, ADC_SINGLE_ENDED);
  ```

## SPI

- If you dont toggle CS pin in some devices, it will not respond to UC and SPI Return 0 or 0xFF all the times. 

A simple LL snippet for SPI Receive 2x8 Bytes
    - Just enable the LL and configure the peripheral from the STM32CubeMX and then

    - ```c
        HAL_GPIO_WritePin(ADC_CS_GPIO_Port, ADC_CS_Pin, GPIO_PIN_RESET);
        LL_SPI_SetTransferSize(SPI1, 2);
        LL_SPI_Enable(SPI1);
        LL_SPI_StartMasterTransfer(SPI1);
        /* Transfer loop */
        /* Check the RXWNE/EOT flag */
        while (!LL_SPI_IsActiveFlag_EOT(SPI1)){}
        adcData[0] = LL_SPI_ReceiveData8(SPI1);
        adcData[1] = LL_SPI_ReceiveData8(SPI1);
        uint16_t adcValue = (adcData[0] << 8) | adcData[1];
        LL_SPI_ClearFlag_EOT(SPI1);
        LL_SPI_ClearFlag_TXTF(SPI1);
        LL_SPI_Disable(SPI1);
        HAL_GPIO_WritePin(ADC_CS_GPIO_Port, ADC_CS_Pin, GPIO_PIN_SET);
    ```

- Minimal Version :
  
  ```c
      ADC_CS_GPIO_Port->BSRR = ADC_CS_Pin << (16U);
      LL_SPI_SetTransferSize(SPI1, 2);
      LL_SPI_Enable(SPI1);
      LL_SPI_StartMasterTransfer(SPI1);
      /* Transfer loop */
      /* Check the RXWNE/EOT flag */
      while (!LL_SPI_IsActiveFlag_EOT(SPI1)){}
      adcData[0] = LL_SPI_ReceiveData8(SPI1);
      adcData[1] = LL_SPI_ReceiveData8(SPI1); // We dont need the lower eight bits
      LL_SPI_ClearFlag_EOT(SPI1);
      LL_SPI_ClearFlag_TXTF(SPI1);
      LL_SPI_Disable(SPI1)
      ADC_CS_GPIO_Port->BSRR = ADC_CS_Pin;
  ```
  
  - Probably the most optimized reading from SPI ( for External ADC  LTC2315 ) ~ 900 Clocks
    
     META TAGS : STM32 External ADC - LTC2315 Reading - High Speed SPI polling
    
    ```c
       // Somewhere in the Main initialization, maybe before while(1)
       LL_SPI_SetTransferSize(SPI1, 2); // Specifying the length of data to read each time
       .
       .
       .
       // In your interrupt
       ADC_CS_GPIO_Port->BSRR = ADC_CS_Pin << (16U);
       SET_BIT(SPI1->CR1, SPI_CR1_SPE);
       SET_BIT(SPI1->CR1, SPI_CR1_CSTART);
       /* Transfer loop */
       /* Check the RXWNE/EOT flag */
       while (!((READ_BIT(SPI1->SR, SPI_SR_EOT) == (SPI_SR_EOT)) ? 1UL : 0UL)){}
       adcData[0] = LL_SPI_ReceiveData8(SPI1);
       adcData[1] = LL_SPI_ReceiveData8(SPI1); // We dont need the lower eight bits
       SET_BIT(SPI1->IFCR, SPI_IFCR_EOTC);
       SET_BIT(SPI1->IFCR, SPI_IFCR_TXTFC);
       CLEAR_BIT(SPI1->CR1, SPI_CR1_SPE);
       ADC_CS_GPIO_Port->BSRR = ADC_CS_Pin;
    ```
    
    -- With some benchmarking : 
    
    ```c
    //    HAL_GPIO_WritePin(ADC_CS_GPIO_Port, ADC_CS_Pin, GPIO_PIN_RESET);
    uint32_t cy3,cy4,cy5,cy6,cy7,cy8;
    cy = DWT->CYCCNT;
    ADC_CS_GPIO_Port->BSRR = ADC_CS_Pin << (16U);
    // 60Cycles
    LL_SPI_SetTransferSize(SPI1, 2);
    // 1056
    cy2 = DWT->CYCCNT - cy;
    LL_SPI_Enable(SPI1);
    // 292
    cy3 = DWT->CYCCNT - cy2;
    LL_SPI_StartMasterTransfer(SPI1);
    // 294
    cy4 = DWT->CYCCNT - cy3;
    /* Transfer loop */
    /* Check the RXWNE/EOT flag */
    while (!LL_SPI_IsActiveFlag_EOT(SPI1)){}
    // 770
    cy5 = DWT->CYCCNT - cy4;
    adcData[0] = LL_SPI_ReceiveData8(SPI1);
    // 420
    cy6 = DWT->CYCCNT - cy5;
    asm("nop");
    //    adcData[1] = LL_SPI_ReceiveData8(SPI1);
    //    uint16_t adcValue = (adcData[0] << 8) | adcData[1];
    cy7 = DWT->CYCCNT - cy6;
    LL_SPI_ClearFlag_EOT(SPI1);
    LL_SPI_ClearFlag_TXTF(SPI1);
    LL_SPI_Disable(SPI1);
    // 702
    cy8 = DWT->CYCCNT - cy7;
    ADC_CS_GPIO_Port->BSRR = ADC_CS_Pin;
    //    HAL_GPIO_WritePin(ADC_CS_GPIO_Port, ADC_CS_Pin, GPIO_PIN_SET);
    ```

## STM32 SPI LL DMA for ADC

![](E:\Projects\Blog\HamedBlog\content\articles\imgs\2021-02-20-11-37-59-image.png)

- Before While(1) -- >
  
  ```c
    uint8_t dataBuffer[2] = {0,0};
    LL_SPI_EnableDMAReq_TX(SPI1);
    LL_DMA_ConfigAddresses(DMA1, LL_DMA_STREAM_0, (uint32_t) &(SPI1->RXDR),(uint32_t) dataBuffer, LL_DMA_GetDataTransferDirection(DMA1, LL_DMA_STREAM_0));
    LL_DMA_SetDataLength(DMA1, LL_DMA_STREAM_0, 2);
    LL_DMA_SetPeriphRequest(DMA1,LL_DMA_STREAM_0, LL_DMAMUX1_REQ_SPI1_RX);
     LL_SPI_EnableDMAReq_RX(SPI1);
    LL_DMA_EnableIT_TC(DMA1, LL_DMA_STREAM_0);
    LL_DMA_EnableIT_TE(DMA1, LL_DMA_STREAM_0);
  ```

- In your timer/while
  
  ```c
        ADC_CS_GPIO_Port->BSRR = ADC_CS_Pin << (16U);
        LL_SPI_Enable(SPI1);
        /* Enable DMA Stream Tx */
        LL_SPI_StartMasterTransfer(SPI1);
        LL_DMA_EnableStream(DMA1, LL_DMA_STREAM_0);
  ```

- In your Interrupt routines : 
  
  ```c
    void DMA1_Stream0_IRQHandler(void)
    {
      /* USER CODE BEGIN DMA1_Stream0_IRQn 0 */
        LL_DMA_ClearFlag_TC0(DMA1);
        LL_DMA_ClearFlag_TE0(DMA1);
         ADC_CS_GPIO_Port->BSRR = ADC_CS_Pin;
         LL_SPI_Disable(SPI1);
      /* USER CODE END DMA1_Stream0_IRQn 0 */
  
      /* USER CODE BEGIN DMA1_Stream0_IRQn 1 */
  
      /* USER CODE END DMA1_Stream0_IRQn 1 */
    }
  ```

## STM32H7 Performance Analysis

Here are some useful benchmarks on STM32H7xx series, when there is no optimization (`none -O0`)

### Enable Cycle Counter:

- First Enable the cycle counter :
  
  ```c
    CoreDebug->DEMCR |= CoreDebug_DEMCR_TRCENA_Msk;
    DWT->CYCCNT = 0;
    DWT->CTRL |= DWT_CTRL_CYCCNTENA_Msk;
  ```

- Then Measure the cycles
  
  ```c
        cy = DWT->CYCCNT;
        FT232_Tests();
        cy2 = DWT->CYCCNT - cy;
  ```

## Measurements Results:

These measurements are based on STM32H7 Microcontroller, I used the a breakpoint on a NOP, here are some details

- Measurement overhead   ~18 Cycles
  
  ```c
        cy = DWT->CYCCNT;
        cy2 = DWT->CYCCNT - cy;
        asm("nop");  // <---- Break point here   - cy2 = 18
  ```

- A simple add of two bytes  `~4 Cycles`

```c
        uint8_t a = 5;
        uint8_t b= 6;
        uint8_t c= 0;
        cy = DWT->CYCCNT;
        c = b+a;
        cy2 = DWT->CYCCNT - cy;
        asm("nop"); // < ---- Break point here   - cy2 = 22        22-18 = 4 Cycles
```

- A simple multiplication of two byte   `~5 Cycles`

```c
        uint8_t a = 5;
        uint8_t b= 6;
        uint8_t c= 0;
        cy = DWT->CYCCNT;
        c = b*a;
        cy2 = DWT->CYCCNT - cy;
        asm("nop"); // < ---- Break point here   - cy2 = 23        23-18 = 5 Cycles
```

- A simple multiplication of two words(32Bits)   `~5 Cycles`

```c
        uint32_t a = 5;
        uint32_t b= 6;
        uint32_t c= 0;
        cy = DWT->CYCCNT;
        c = b*a;
        cy2 = DWT->CYCCNT - cy;
        asm("nop"); // < ---- Break point here   - cy2 = 23        23-18 = 5 Cycles
```

- A function call   `~26 Cycles`

```c
        cy = DWT->CYCCNT;
        testFunc();
        .
        .
        .
        void testFunc(){
          cy2 = DWT->CYCCNT-cy;
          asm("nop"); // < ---- Break point here   - cy2 = 44     44-18 = 26 cycles
        }
```

- A inline function call   `~0 Cycles`

```c
        inline void testFunc () __attribute__((always_inline));
        .
        .
        .
        int main(){
        .
        .
        .
        cy = DWT->CYCCNT;
        testFunc();
        }
        .
        .
        .
        inline void testFunc(){
          cy2 = DWT->CYCCNT-cy;
          asm("nop"); // < ---- Break point here   - cy2 = 18     18-18 = 0 cycles
        }
```

> GCC does not inline any functions when **not optimizing** unless you specify the ‘always_inline’ attribute for the function, like this:

> ```c
>       /* Prototype.  */
>    inline void foo (const char) __attribute__((always_inline));
> ```

Calling a function overhead :  ~60cycles

## Synchronous GPIO + DMA

[Parallel synchronous transmission using GPIO and DMA](https://www.st.com/resource/en/application_note/dm00169730-parallel-synchronous-transmission-using-gpio-and-dma-stmicroelectronics.pdf)

## 

## STM32 UART

### LL Configuration

#### Continous receive over UART using IT

- Activate UART in CubeMX

- In  CubeMX from Project manager -> Advanced Settings - > UART/USART, choose LL

- Add following code snippet in your `main.c`
  
  ```c
  void USART_CharReception_Callback(void)
  {
      uint8_t *ptemp;
  
    /* Read Received character. RXNE flag is cleared by reading of RDR register */
  
      p_rxBuffer[rxBufferIndex]  =  LL_USART_ReceiveData8(USART1);
      if(rxBufferIndex > 1){ // When we received at least 3 chars
          if(p_rxBuffer[rxBufferIndex-1] =='\r' && p_rxBuffer[rxBufferIndex] == '\n'){ // if last two were \r\n, then it is a line
              // Swap rxBuffer with rxReadyBuffer
              ptemp = p_rxReadyBuffer;
              p_rxReadyBuffer = p_rxBuffer;
              rxReadyBufferSize = rxBufferIndex;
              p_rxBuffer = ptemp;
              rxReadyFlag = 1; // Inform user command handler
              rxBufferIndex = -1; // Ready for next data batch, it will reach 0, after next increment
          }
      }
      rxBufferIndex++;
  }
  
  void USART_Error_Callback(void)
  {
    __IO uint32_t isr_reg;
  
    /* Disable USARTx_IRQn */
    NVIC_DisableIRQ(USART1_IRQn);
  
    /* Error handling example :
      - Read USART ISR register to identify flag that leads to IT raising
      - Perform corresponding error handling treatment according to flag
    */
    isr_reg = LL_USART_ReadReg(USART1, ISR);
    if (isr_reg & LL_USART_ISR_NE)
    {
      /* case Noise Error flag is raised : Clear NF Flag */
      LL_USART_ClearFlag_NE(USART1);
    }
    else
    {
      /* Unexpected IT source : Set LED to Blinking mode to indicate error occurs */
  //    LED_Blinking(LED_BLINK_ERROR);
    }
  }
  
  void usartSendChar(uint8_t ch){
  
        LL_USART_TransmitData8(USART1,ch);
        /* Wait for TC flag to be raised for last char */
        while (!LL_USART_IsActiveFlag_TC(USART1))
        {
        }
  
  }
  void configAppUART(){
      LL_USART_ClearFlag_ORE(USART1); // Clear Overrun
      LL_USART_EnableIT_RXNE(USART1); // RX not Empty INT
      LL_USART_EnableIT_ERROR(USART1); // Error INT
      p_rxBuffer = rxBufferA;
      p_rxReadyBuffer = rxBufferB;
  }
  ```

- Change USART1_IRQHandler in `stm32l0xx_it.c` to following code

```c
void USART1_IRQHandler(void)
{
  /* USER CODE BEGIN USART1_IRQn 0 */
      /* Check RXNE flag value in ISR register */
      if(LL_USART_IsActiveFlag_RXNE(USART1) && LL_USART_IsEnabledIT_RXNE(USART1))
      {
        /* RXNE flag will be cleared by reading of RDR register (done in call) */
        /* Call function in charge of handling Character reception */
        USART_CharReception_Callback();
      }
      else
      {
        /* Call Error function */
        USART_Error_Callback();
      }
  /* USER CODE END USART1_IRQn 0 */
  /* USER CODE BEGIN USART1_IRQn 1 */

  /* USER CODE END USART1_IRQn 1 */
}
```

### Receive a variable size string line using interrupt

- Activate UART in CubeMX

- Activate UART global interrupt in NVIC

- Add this line of code in your main function after initalization, it will configure and activate the UART receiving block, and it will throw an interrupt upon receving a byte.

```c
/* USER CODE BEGIN PV */
uint8_t dummyData = 0;
uint8_t New_UART1_Data = 0;
/* USER CODE END PV */

void main(){

/* USER CODE BEGIN 2 */


}
HAL_UART_Receive_IT(&huart1, &dummy, 1);
```

- then switch to `stm32l0xx_it.c` file and change it accordingly 
  
  ```c
  /* USER CODE BEGIN 0 */
  uint32_t tmp_sts = 0;
  uint8_t UART1_InBuffer[255];
  uint8_t UART1_BufferCount = 0;
  #define HJ_ClearUARTError(__HANDLE__)           \
    do{                                           \
      __IO uint32_t tmpreg;                       \
      tmpreg = (__HANDLE__)->ISR;                  \
      tmpreg = (__HANDLE__)->RDR;                  \
      tmpreg = tmpreg;                             \
    } while(0)
  extern uint8_t New_UART1_Data;
  /* USER CODvoid USART1_IRQHandler(void)
  {
    /* USER CODE BEGIN USART1_IRQn 0 */
      tmp_sts = USART1->ISR;
      if ((tmp_sts & (1 << 0)) == (1 << 0)) {
          huart1.ErrorCode = HAL_UART_ERROR_PE;
          HJ_ClearUARTError(USART1);
      } else if ((tmp_sts & (1 << 1)) == (1 << 1)) {
          huart1.ErrorCode = HAL_UART_ERROR_FE;
          HJ_ClearUARTError(USART1);
      } else if ((tmp_sts & (1 << 2)) == (1 << 2)) {
          huart1.ErrorCode = HAL_UART_ERROR_NE;
          HJ_ClearUARTError(USART1);
      } else if ((tmp_sts & (1 << 3)) == (1 << 3)) {
          huart1.ErrorCode = HAL_UART_ERROR_ORE;
          HJ_ClearUARTError(USART1);
      } else if (USART1->ISR & USART_ISR_RXNE)    // Successful Reception of USART
      {
          uint8_t tmprx = USART1->RDR;
          if (tmprx != '\r') {
              if (tmprx != '\n') {
                  UART1_InBuffer[UART1_BufferCount] = tmprx;
                  UART1_BufferCount++;
              } else if (UART1_BufferCount > 1)    //if \n received
              {
                  UART1_InBuffer[254] = 0;    // Put a safety terminator at end of buffer
                  UART1_InBuffer[UART1_BufferCount] = 0;    // Put Terminator at end
                  UART1_BufferCount = 0;
                  New_UART1_Data = 1;
              }
          }
      }
      return;
    /* USER CODE END USART1_IRQn 0 */
    HAL_UART_IRQHandler(&huart1);
    /* USER CODE BEGIN USART1_IRQn 1 */
  
    /* USER CODE END USART1_IRQn 1 */
  }
  _IRQn 1 */
  }
  ```

```
## Libraries

### ModBus Library

[GitHub - alejoseb/Modbus-STM32-HAL-FreeRTOS: Modbus RTU Master and Slave for STM32 using Cube HAL and FreeRTOS](https://github.com/alejoseb/Modbus-STM32-HAL-FreeRTOS)

## STM32 Evaluation Boards with display

- [STM32H743I-EVAL2](https://ie.farnell.com/stmicroelectronics/stm32h743i-eval2/evaluation-board-32bit-arm-cortex/dp/3021474)  - 432 euro
- [STM32429I-EVAL1](https://ie.farnell.com/stmicroelectronics/stm32429i-eval1/eval-brd-stm32f42x-mcus/dp/2365196)  -  348 euro
- [STM32F7508-DK](https://ie.farnell.com/stmicroelectronics/stm32f7508-dk/discovery-kit-32bit-arm-cortex/dp/2987048)   -  51.40 euro
- [STM32F769I-DISCO](https://ie.farnell.com/stmicroelectronics/stm32f769i-disco/discovery-board-mcu/dp/2546570) - 82 euro

## Display only

[Brand new 7 "IPS full viewing Angle 1024X600 RGB LCD Screen universal 50Pin +GT911 touch screen|Tablet LCDs & Panels| - AliExpress](https://www.aliexpress.com/item/33047054739.html?src=google&albch=shopping&acnt=708-803-3821&isdl=y&slnk=&plac=&mtctp=&albbt=Google_7_shopping&aff_platform=google&aff_short_key=UneMJZVf&&albagn=888888&isSmbAutoCall=false&needSmbHouyi=false&albcp=11491598104&albag=115199750874&trgt=449349191507&crea=en33047054739&netw=u&device=c&albpg=449349191507&albpd=en33047054739&gclid=Cj0KCQiAgomBBhDXARIsAFNyUqMHQybagBl9sau_QHdCuIrwycXZ6qCWL0Cp3FfoZpORbGYWXYzJcKkaAlxLEALw_wcB&gclsrc=aw.ds)
```





## Low Power Check list

- Check all the resistor - Pull ups/ Pull downs to find the current consumption by them

- Put all the unused pins of microcontroller in the Analog mode to deactive internal schmitt trigger ( page 12 of [STM32 microcontroller GPIO configuration for hardware settings and low-power consumption - Application note](https://www.st.com/resource/en/application_note/an4899-stm32-microcontroller-gpio-configuration-for-hardware-settings-and-lowpower-consumption-stmicroelectronics.pdf))

- Around 300ua is just for programmer connection (SWDIO + SWDCLK + RST + VCC + GND)

- Sleep mode with main regulator on adds around 40uA

- Check all the GPIO pins state, they might keep another connected device in the non-sleep mode

- Check the leakage current of capacitors
