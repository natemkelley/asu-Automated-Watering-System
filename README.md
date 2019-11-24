# Welcome to my Automated Watering System!

[![Demo Video Play Image](http://img.youtube.com/vi/_g6O5HthypE/0.jpg)](http://www.youtube.com/watch?v=_g6O5HthypE "Demo Video")

## Disclaimer

> **Note:** This software was made as a final project for a class at ASU called **HSE 424 - Human Automation Interaction**. The course was taught by **[Erin Chiou](https://isearch.asu.edu/profile/3015725)**  The purpose of this class was to explore the human side of automation and included lengthy research topics related to psychology, trust, management. I have done my best to bridge this repo between academia and reality. Although this was made for a class I encourage you to fork, commit, or clone my work and use it for your own projects!

# Introduction

This full-stack system allows gardeners to set certain thresholds that, when met, will trigger the system to water their lawn or plants. The system would check for weather conditions, moisture levels, and could be to check at certain times of the day or every few minutes depending on the need of the gardener. You will be able to build a full functional automated watering system for under $50.

# Required Materials

## Physical Materials

-   Raspberry Pi 3 or better
-   Solenoid
    
-   Moisture Sensors
    
-   Bread Board
    
-   Collection of Resistors
    
-   Bread board wires

## Other Materials
-   Expert knowledge of [Vue.js](https://vuejs.org/)
    
-   Working knowledge of [Nuxt.js](https://nuxtjs.org/)
    
-   Basic knowledge of [Express](https://expressjs.com/)
    
-   Basic knowledge of [Raspberry Pi](https://www.raspberrypi.org/)
    
-   Working knowledge of electricity (Voltage, Ohms, Amperage).

# Installation
## Software
This project assumes a working knowledge of Raspberry Pi and JavaScript frameworks. So to begin you will need to install the latest version of Node on your raspberry.

Once that has been done, setup the initial project by cloning the repo, installing the modules, and starting the server. Assuming you have ssh-ed into your Raspberry Pi and navigated to the folder you want to install the program in, run the following commands:
```bash
# clone repo
$ git clone https://github.com/natemkelley/Automated-Watering-System---HSE-424.git

# navigate to cloned folder
$ cd automated-watering-system

# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

```

If you have setup the dev or run the actual build, you should see the website running on `port 3000`.

![enter image description here](https://lh3.googleusercontent.com/Bkba9-anqcRAt56tg9xYhjP25NNf7O_71y7CnGMyaOS4z641mQ2szG7ptTJtzb1eAcDPprEp_0Dm "Automated Watering System Full Page")

### Front-end Explanations

If you want to modify the settings of any component they should be intuitively organized by name with props being passed directly from the site index (pages/index). Ideally, the index should be the only thing calling the api and props will cascade down to the individual components.

Refreshes are triggered in various components and uses Vue’s Vuex feature. Nuxt defines Vuex under “/store”. It is worth noting that this project only uses Vuex to change state which, when changed, triggers the API call. If you build any components of your own use this Vuex function to trigger the refresh:

```javascript
this.$store.commit("triggerRefresh"); //this will trigger a refresh
```
| Component | Props |
|--|--|
| CurrentSettings.vue | Props: color, weatherSettings |
| CurrentStatus.vue | Props: weatherSettings |
| Footer.vue | No Props |
| MoistureSensors.vue | Props: weatherSettings |
| RecentUpdates.vue | Props: logs |
| Sidebar.vue | Not enable or functional |
| TopBar.vue | Props: color |
| Weather.vue | Props: color, weatherSettings, weather |
| weather/BarChartWithAnnotation.vue | Props: weatherSettings, weather |
| weather/DraggableHumidityChart.vue | Props: weatherSettings, weather |
| weather/DraggableWeatherChart.vue | Props: weatherSettings, weather |
| weather/TimesWithSwitch.vue | Props: weatherSettings, weather |

### Back-end
The API uses a node library which uses a scratch space like a database. This decision was made concisely to limit database dependencies and possible issues which might arise from people using different version of Raspberry Pi. The end points are defined in “api/index.js”. The raspberry Pi functionality is defined under “api/raspberryPi.js”. The raspberry pi functionality will actually be discussed under “Customization”.

| Endpoint | Calls/Returns |
| / | Get: Return true if api is working |
| --- | --- |
| /force-system-run | Get: Return true is system was forced to run |
| /system-check | Get: Returns true if weather and moisture sensors were updated. Handler added on client to then grab updated information. |
| /logs | Get: Returns json object of 100 most recent logs |
| /current-weather | Get: Returns current weather from openweathermaps.org |
| /weather | Get: Return historical weather |
| /weather-settings | Get: Returns json object of current weather settings

Post: (name of weather prop, value, active status) |
| /moisture-status | Get: Returns json object of current moisture sensors settings

Post: (name of moisture sensor prop, value, active status)

\*See moisture sensor component for more details |

### Hardware

In order for the pipe  to turn off and on you will need to implement a solenoid into your pipe. Because there are so many kind of solenoids and so many sizes of pipes, I will not be of much help. However, I will include what I did.

I purchased on a 12V 500mA solenoid because I already had a 12V AC adapter which ran a
600mA current at my house. I cut off the adapter at the end and attached the two wires into a
breadboard (pictures found below). I then spoke with an electrical engineer who helped me purchase a relay rated at 500mA. We chose this particular relay because it fit within the current that the Raspberry Pi pins put out. I also purchased some resistors to bring up the voltage from my Pi to help power the water meter. I then arranged the relay, 12V Solenoid, water meter, and Raspberry Pi on a breadboard so that when the Raspberry Pi pin went high, the solenoid would activate causing it to close. 

All of the Raspberry Pi controls are found in “api/raspberryPi.js”. This uses the [https://www.npmjs.com/package/raspi](https://www.npmjs.com/package/raspi) library which will assist you to turn on the activating script found there. If you look into the raspberryPi.js script you will find that there are two script to turn on and off the solenoid. You will just need to change which GPIO pin is high to turn it off or on.

![enter image description here](https://lh3.googleusercontent.com/icSgXgv46YkeGr-gGPdip_WXPJTmfAF4A5WDPxGMz7IIlqAj1jKGVAWtfOFbuNnpQUqhhV0_KryG "Breadboard")

![enter image description here](https://lh3.googleusercontent.com/JG9ON89PchllC5N45eXCz6Yu4QUNBULGXMni2JvPYYmz7Xv96MOz4TRurmX3KZSAF056UULcGhOj "Setup")

**The moisture sensors I used were found through [https://thepihut.com/blogs/raspberry-pi-tutorials/raspberry-pi-plant-pot-moisture-sensor-with-email-notification-tutorial](https://thepihut.com/blogs/raspberry-pi-tutorials/raspberry-pi-plant-pot-moisture-sensor-with-email-notification-tutorial). These were placed at different point of my planter but could be placed at different parts of a lawn. However, if you choose to do that it would require additional engineering. In any case, you will want to follow the tutorial found at that website as it explain exactly how to setup the sensors and set the thresholds.**

The only changes you will need to make will be change the pins that are recognized in “api/raspberryPi”. If the pin is high, the sensor will be true. If the pin is low, it should be false.

![enter image description here](https://lh3.googleusercontent.com/-lmG30DlVgFD2JyTPAkQvEvMzXzG-rLXiJfMLXUigLiESOjtJbvaE6_03RFwceDgGsf-PgO9tOtB "Pot and sensors")

## Customization
The current project has ASU’s zip code hard coded in for the weather api. You can change this location by looking at the weather function in index.js.

Apart from the weather, if you fork my repo your own knowledge of Raspberry Pi and Nuxt are the limit! Feel free to create any components you don’t already see here!

## Limitations
This project has not been designed for a mobile experience. Although many of components scale, they will look horrible on smaller screen sizes. This could be a commit if anyone wants to contribute! 

Additionally, no user testing on this project has been done and many of the mental models, terminology, and variables used were from my own understanding of the world which may differ from other developers. It is also worth noting that the weather api from `openweathermaps.org` only allows for 100ish request a day. If you set your program to run more frequently than that you will run into issues. In this software by default, you cannot check the weather more than 4 times an hour to prevent this issue. However, if you are hard coding your variables inside the `weather.vue` you will see that you can change this setting.

If the power goes out, this program will not work. This could be an issue if you purchase a solenoid that is by default open. BE SURE TO BY ONE THAT IS BY DEFAULT CLOSED or you will find your lawn being watered if there is a power outage. Lastly, if the weather api cannot be reached the automation will fail. Full connectivity is required and assumptions that the weather api will always be accessible have to be made with the current version of the program.

## Principles Used
In order to describe the human-automation principles used in this software, I will go through each component individually describing what exactly was changed or influenced.

### Top Bar
The top of the program has a navigation bar that allows the user to force run the system. However, before the system will run it will confirm that the user wants to perform that action. If the system is already running, the user can force stop the system. This component harkens back to Thomas Sheridan’s concept of “supervisory control”. The user can see if the system is currently running and make a decision about what to do from there. As you will see from the later components, this system is a “strict system” which means that the program functions with parameters set by the human (Sheridan, 2002).

The force stop could be considered a level of system safety which allows the user to stop a process midstream.

### Current Settings
This component shows that it is a “strict system”. The user sets certain parameters and allows the system to run on its own. With a system like this, lessons from John D. Lee’s paper on trust have been used. In this paper, trust appropriateness and trust resolution are explained to be essential when it comes to understanding automation capabilities and human-automation relationships. Therefore, automation should be designed for appropriate trust and the purpose and capabilities of said automation should be clear to operators (Lee, 2004).

This component integrates with other components which show how changes here impact the performance of the system. For example, if the temperature is changed from the AND column to the OR column, the current status will change. The terms used in this component are also defined in a drop down menu to help clarify and promote trust on the user’s part. However, due to the highly autonomous nature of the software, i.e. the system will run continuously once the settings are in place, the user can become complacent and trust the system too much by never looking at the recent run logs or the weather reports that it is running. The gardener might be surprised that his thresholds were not what he actually needed and killed his plant or lawn.

![enter image description here](https://lh3.googleusercontent.com/cGZb2fQpAQtJPyLQdc4NhVkBFia8pZeQn38aeTNMeNgxChlDJX3TO1fssMbfrSgYC4B9BS2oWz2L "Current Settings")

### Weather 
This component allows the user to set the threshold that the automation pipeline is checking for. The second screenshot shows that the component will grey-out if it is disabled. **
![enter image description here](https://lh3.googleusercontent.com/0zjXXs2bh__cjCS6jciZC4KajcstVZZST0AGd4MwWkixEDksGMorGUrjUfdmdTqPFI7rAolrvUs7 "Weather")

### Current Status
This component allows the user to see what the current levels of the system are and make judgments about what to do from there. The green “System will run on the next trigger” indicator uses Joachim Meyer concept of binary indicators to alert the user of what will happen on the next trigger (Meyer, 2001).

![enter image description here](https://lh3.googleusercontent.com/ONSRJJPKA7vsDkAtSBuk9ZBmr76wexFsmfmFq8UrAUXSHEKYRpoxK-lt_A76m70LYw6SUfxr4ZMv "Current Status")

### Recent Updates
This system monitoring component uses Hollnagel’s Safety II approach. In this approach the evaluators try to ensure that as few things go right as possible by making a list of what went right. This log component keep track as all sensor, weather, and system status information so that operators can see how the system was performing at a certain time and cross check that with how it should be. This means the operator focuses on what is right rather than what went wrong is with the system. From here the operator can see what each threshold level was and decide from there as to whether it ran improperly or not (Hollnagel, 2012).

![enter image description here](https://lh3.googleusercontent.com/oN6RjdSuuQ9Y7aFpyseqDs2K5UmcljZcnWMXZHTjMcipLSEpWOs5hisX5iXOXNrrCHS5oTaGJ49l "Recent Updates")


# Citations

> ***APA Citation formatting may be stripped through Markdown.***

Hollnagel, Erik. 2012. A Tale of Two Safeties. http://erikhollnagel.com/A%20Tale%20of%20Two%20Safeties.pdf

Lee, John D., See, Katrina A., Spring 2004, Trust in Automation: Designing for Appropriate Reliance. https://user.engineering.uiowa.edu/~csl/publications/pdf/leesee04.pdf

Meyer, Joachim. January 1, 2001. Effects of Warning Validity and Proximity on Responses to Warnings. http://hfs.sagepub.com/content/43/4/563.

Sheridan, Thomas. July 11, 2002. Humans and Automation Chapter 6: Supervisory Control.
