# referencing a base image
FROM python:3.11

ENV PYTHONUNBUFFERED=1

WORKDIR /code

# copy all python dependencies needed, then
# install in the docker container
COPY requirements.txt .
RUN pip install -r requirements.txt

# copy the django_backend folder to the container
COPY . .

# Specifying the port number being used (8000 for Django)
EXPOSE 8000

# Specifying commands to run the project
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]