# MarketApp

Message from Kwaku Ofosu

September 9th, 2023
Updated October 6th, 2023

Hello everyone!  I am including instructions on how to run the app on your local computer.  These instructions assume that you have both Python installed (i.e. via Anaconda) and an IDE text editor installed such as VS Code.

**How to run the project (in a development server)**
1. Install Django on your local computer.  For more details, please see their official installation documentation here: [https://docs.djangoproject.com/en/4.2/topics/install/](url).  If you are using Anaconda, you can also consider installing Django in a virtual environment by running the corresponding pip commands inside of the running virtual environment.
2. Pull the project information from the repository.
3. Open your computers command prompt and change the current directory path to this project, specifically the myproject folder.  One thing you can do is open the marketapp folder in your file explorer, right-click on the _myproject_ folder, and copy as path.  Then, paste "cd [path]" into the terminal.  If you have python installed through Anaconda, make sure to open the command prompt inside of Anaconda Navigator.
4. Please install Django's environment variables.  This feature, used for the email configuration, is needed for the development server to run.  Run the following command on your terminal: _pip install django-environ_  
5. Run the command _python manage.py runserver_.  Assuming everything works well, the command line should then display a url that contains the server that the app is currently running in (Starting development server at [url]).  To close the project, press CTRL+C.

If you have any further questions about installation or anything else about the app, please don't hesistate to ask me!

Best,
Kwaku Ofosu

