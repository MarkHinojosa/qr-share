# qr-share

Goals:
Simple poc that shows this functionality 
* user uploads document 
* user gets shareable qr code to the path of document
* shared qr code can download the document
* The lockton logo found here should be on the top https://lockton.com/ 
With a Powered by <herc logo> on the bottom small



How To Use:
* Must have exp, check your version with exp --version
* Git clone repo
* Navigate to root directory & npm install
* Start Genymotion Virtual Device
* Start app with exp start and open a sperate terminal and use exp android
* Create a simple text file and drop it into your Genymotion device
* Use the "Select Document" button to find the text file in the downloads folder
* File name and File size will be shown and an "Upload" button will appear
* Select "Upload" and file should be pushed to firebase storage
