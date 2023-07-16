# Smart Recharge
Smartphone recharging application.
## Purpose
To eliminate the need to manually key in the digital top up code when recharging. Let the app do the keying in and you do the validation and making request call.
## Installation
To install this app just visit [Smart Recharge](https://mark-code789.github.io/Smart-Recharge/).

**Remember:** 
_most of the functions in the app require latest browser version to work._

After opening the link you will be prompted to install the app. For Chrome browsers version 89 and above will install the app natively while other browsers such as Opera and UC brower will just add the app to the homescreen. Some browsers do not fire the `beforeInstallEvent` so be sure to install or add to homescreen manually.
## How it works
Smart Recharge uses `mediaDevices` API to access the user camera and then display the stream using the `video` element. 
A snapshot of the video is taken by drawing the video on `canvas` cropping it using the scanning frame dimensions.  
The snapshot is then fed to [Tesseract](https://github.com/naptha/tesseract.js?files=1) library for scanning, which returns a string representing the output of the action. 
This output is validate and if it fails the above process is repeated.
## Pros
- Works better than native apps. 
- Allows scanning of previously taken images. 
- Uses minimal storage space compared to native apps.
- Easy to update.
## Cons
- Requires latest browsers. if not update is needed.
- Difficult to read user SIMs and making the call directly without requiring user permission.
- Due to difficulty of reading user SIM information, the app primarily supports Kenyan mobile carrier USSD codes. 
## Contributing
Thank you for supporting this project. Contributions and suggestions are welcomed to make this effective and efficient.  
I will highly appreciate contributions for: 
- Getting cross-browser SIM information.
- Making a call directly to the Mobile Carrier without using javascript `tel`.
