#include <Wire.h>
#include <WebUSB.h>
#include "Adafruit_TCS34725.h"

byte gammatable[256];

Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_1X);

int currentButtonState;
int lastButtonState = LOW;

WebUSB WebUSBSerial(1,"http://127.0.0.1:5500/index.html");
//WebUSB WebUSBSerial(1, "https://michellemqwu.github.io/rnd-phone-addon/rnd-phone-addon-web/");
#define Serial WebUSBSerial

void setup() {
  Serial.begin(9600);
  Serial.write("---------------------- Start! \r\n> ");
  Serial.flush();

  pinMode(2, INPUT_PULLDOWN);

  if (tcs.begin()) {
  } else {
    Serial.println("No TCS34725 found ... check your connections");
    while (1)
      ;
  }

  for (int i = 0; i < 256; i++) {
    float x = i;
    x /= 255;
    x = pow(x, 2.5);
    x *= 255;
    gammatable[i] = 255 - x;
  }
}

void loop() {
  String sensorResults = "RED-GREEN-BLUE-BUTTON";
  float red, green, blue;
  tcs.setInterrupt(false);
  delay(60);
  tcs.getRGB(&red, &green, &blue);
  tcs.setInterrupt(true);

  sensorResults.replace("RED", String(int(red)));
  sensorResults.replace("GREEN",String(int(green)));
  sensorResults.replace("BLUE", String(int(blue)));

  currentButtonState = digitalRead(2);
  if (currentButtonState > lastButtonState) {
    sensorResults.replace("BUTTON", "1");
  } else {
    sensorResults.replace("BUTTON", "0");
  }
  Serial.println(sensorResults);
  lastButtonState = currentButtonState;
}