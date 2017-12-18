# buddyfinder

## Introduction

You'd love to visit a contemporary art exposition but your better half is more of a renaissance person? Your friends ride mountain bikes but you're a roadi? You're an erasmus student and tired of eating alone? Maybe your tennis buddy is sick and the court is already reserved... No matter the reason, buddyfinder is here to help. Buddyfinder is meant for any spontaneous extracurricular activity. Simply name the activity, location and time to find people to share it with. All you need to get started is a valid unibe, unifr or unine e-mail address and off you go!

In the first version, we will most certainly build the whole activity creation, sharing and inviting/joining part. As well as the authentication and authorization for uni-be, fr, ne addresses. We also plan to build a responsive GUI such that it can be used on any screen.

If time allows we will add some extra features such as uploading pictures from the activities to create a Uni-Recreational album, enable commenting, publishing to other social networks, etc... We will see along the way which makes the most sense and what time allows us to do.

Technology wise we are only bound to Node.Js and GitHub so far. Considering the application we think that a no-SQL DB will be most appropriate, we haven't chosen which one we will use yet. We will deploy our app on a PAAS, but here again, we haven't made a choice at this stage of the project.

## Requirements

- nodejs 4.x.x
- mongodb 3.x
- npm

## How to run it

Clone this repository into a folder of your choice and run npm install in order to install all required nodejs packages
and their dependencies:

	npm install

Then you are ready to run the server:

	npm start

Interact with the server from your browser.

## Dev Tools used

- Postman is a very nice Chrome add-on or standalone application that allows to easily interact with the server and
issue HTTP requests with or without body (JSON).
- cURL (https://curl.haxx.se/docs/manpage.html)

## DB Schema

The DB Schema should be build having the most frequent use cases in mind. Therefore the Schema should consist of two
collections, namely the activity and user collections. Users interested in a specific activity will be added to it
or removed from it. So when Peter is interested in the activity running, with a regular single scan all users interested
in this activity will be querried.

Activity:

```json
{
    "_id": "eb7614e0-e32c-11e7-9259-4535fcd7dabd",
    "name": "Tasting Beer",
    "description": "Drinking Beer is not for losers, we meet up every Tuesday at the Trappist and taste their new beers. We discuss them and quite often the owner joins us and shares his amazing knowledge about this art of making and drinking beer.",
    "location": "Rathausgasse 68, 3011 Bern",
    "date": "every Tuesday",
    "time": "20:30",
    "popularity": 2,
    "users": [
        {
            "user": "jane_0d",
            "email": "jane@jane.com",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTM1OTA3MDJ9.EsQ1dDmfHse0zrwCmU5Y3fzMIDAoh7MHvc6hBS9L_zU"
        }
    ]
}
```

Users:
```json
{
    "_id": "0d4a9710-e3d9-11e7-bfb3-f3bb92089474",
    "username": "jane",
    "email": "jane@jane.com",
    "password": "$2a$10$01JachjThTWZpAxng5pe..t1OjTfvEAtZDQnYBKPHF6snUSm/E7y6",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTM1OTA3MDJ9.EsQ1dDmfHse0zrwCmU5Y3fzMIDAoh7MHvc6hBS9L_zU"
}
```

## Working Routes - API_Activities

  > GET /api/activities -> lists all activities in JSON format
  
  > GET /api/activities/{name} -> lists details of one activity in JSON format
  
  > POST /api/activities -> Creates new Document (payload must be in JSON) in activity collection
  
  > POST /api/activities/{_id}/upvoteActivity -> rate up the activity
  
  > POST /api/activities/{_id}/downvoteActivity -> rate down the activity
  
  > POST /api/activities/{_id}/signUp -> sign up for a specific activity
  
  > POST /api/activities/{_id}/signOff -> cancel the participation of one specific activity
  

## Working Routes - API_Users
  
  > GET /api/user/{name} -> stub for {name}'s public profile
  
  > POST /api/login -> log in with a existing user
  
  > POST /api/register -> register a new user

  
## Working Routes - Webpage_Activites

  > GET / -> landing page
  
  > GET /create -> Form to create a new activity
   
  > POST /create -> Sends the filled form to the server for creation of activity
  
  > GET /activities/{_id} -> Displays one detailed activity
  
  > POST /activities/{_id}/upvoteActivity -> upvotes the activity
  
  > POST /activities/{_id}/downvoteActivity -> downvotes the activity
  
  > POST /activities/{_id}/signUp -> signs the user up for an activity
  
  > POST /activities/{_id}/signOff -> signs the user off the activity
  

## Working Routes - Webpage_Users
  
  > GET /login -> Shows the login page
  
  > POST /login -> Authenticates the user
  
  > GET /logout -> Deletes the session
  
  > GET /registe -> Form to register new user
  
  > POST /registe -> Sends the filled form for registration
  
 
  
