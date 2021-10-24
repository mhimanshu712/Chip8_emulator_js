<p align='center'>
<img width="350"  src="https://github.com/mhimanshu712/chip8/blob/master/images/chip8.png" />
</p>
<h1>Chip8 Emulator :pager: </h1>

![JavaScript](https://img.shields.io/badge/-JavaScript-333333?style=flat&logo=javascript)
![CSS](https://img.shields.io/badge/-CSS-333333?style=flat&logo=CSS3&logoColor=1572B6)

An awesome looking Chip8 emulator written in vanilla javascript, initially loads Space Invaders <br>
But custom ROM can be loaded, by clicking on the power button (RED) <br>
[Click to launch](https://play-chip8.web.app/)


## Getting Started
This project uses ParcelJs to bundel the files. To get started run<br>
```
npm run start
```

The Chip8 cpu instructions (36 instructions) have been implemented in the  **chip.js** file. <br>
It also implements memory and the registers. <br> <br>
The file **spaceInvaders.js** contains the binary of the game stored in an Uint8Array. <br>
Rest of the files handle keyboard, screen (64 x 32) and sound (basically an annoying buzzer).

## Key Mappings
Space invaders can be played by using `w` ,`a` and `d` keys. <br>
All the key mappings are present in **Keyboard.js**


## Read More
How To : https://tobiasvl.github.io/blog/write-a-chip-8-emulator/ <br>
Technical Reference : http://devernay.free.fr/hacks/chip8/C8TECH10.HTM
