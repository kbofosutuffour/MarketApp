# MarketApp

Welcome to the market app development codebase.  Both the frontend and the backend code for the app can be found within these files.  

The frontend portion, located in the _marketapp_mobile_ directory, uses _**React Native**_, a TypeScript framework used to create cross-platform mobile applications (Android and iOS).  This portion controls the user experience, meaning how the app looks to the user.  The implementation of our design is done using this frontend portion.  Please visit this link to view our current design ideas: https://www.figma.com/file/uGgTmOZG8ddqpvimETXR8d/W%26M-Market-App?type=design&node-id=0-1&mode=design.

To run and develop the frontend, please refer to the auto-generated README file inside of the marketapp_mobile directory.  Developers can work on front-end development with demos on their own mobile devices using _Expo Go_.  Please follow this link to learn more and set up a development environment on your mobile devices: https://expo.dev/client.

The backend portion, located in the _django_backend_ directory, uses _**Django**_, a Python-based backend framework.  Specifically, we use Django's _REST Framework_ to develop a REST API that communicates between the frontend of a mobile device to the backend of Django.  In production, the django_backend code base is stored and runs continuousely on Amazon Web Services (AWS), specifically using an Amazon EC2 Instance.  In development, the backend is run using the normal Django development server process.  If you are developing in the development branch, please refer to the README file located in the django_backend folder to develop.  

Note that in addition to the default Django development server process, developers should also use _ngrok_ or a similar service.  Mobile phones require that and HTTP requests are done using HTTPS urls, but localhost uses an HTTP url by default.  Ngrok provides users with an HTTPS link that points directly to their localhost, which allows mobile apps to be able to use the REST API.

If any questions remain while developing the app, don;t hesitate to DM me on discord.  Thanks for helping with the market app development!

Best,
Kwaku Ofosu

