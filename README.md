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
- cURL (https://curl.haxx.se/docs/manpage.html).
- WebStorm, Atom and other IDE's

## DB Schema

The DB Schema should be built having the most frequent use cases in mind. Therefore the Schema should consist of two
collections, namely the activity and user collections. Users interested in a specific activity will be added to it
or removed from it, the same goes for upvoting and downvoting an activity. Querrying all users that are interested in
a sepcific activity will therefore require only to find this one activity and parse the content in order to retrieve
all interested people. Downvoting an upvoting is also activitiy specific and the information is simply pushed into the
collection when somebodey likes or dislikes it.

Activity:

```json
{
    "_id": "eb7614e0-e32c-11e7-9259-4535fcd7dabd",
    "name": "Tasting Beer",
    "description": "Drinking Beer is not for losers, we meet up every Tuesday at the Trappist and taste their new beers. We discuss them and quite often the owner joins us and shares his amazing knowledge about this art of making and drinking beer.",
    "location": "Rathausgasse 68, 3011 Bern",
    "date": "Tuesday",
    "time": "20:30",
    "popularity": 3,
    "tag": "Going Out",
    "img": "https://www.sbs.com.au/news/sites/sbs.com.au.news/files/4d9151aa-b327-4d91-8232-a6f3da7f6f02_1466841316.jpeg",
    "users": [
        {
            "user": "jane_0d",
            "email": "jane@jane.com",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTM1OTA3MDJ9.EsQ1dDmfHse0zrwCmU5Y3fzMIDAoh7MHvc6hBS9L_zU"
        },
        {
            "user": "john_e1",
            "id": "e1267e10-e59a-11e7-bf5e-55d794aba371",
            "email": "john@john.com",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTM3ODM5MDJ9.KMU6GScF2Yv0jF9U-bNprYZMnYs3-Ooz5ywhd33mkBY"
        },
        {
            "user": "tomasz_51",
            "id": "51e19390-e5a2-11e7-a4e8-5333f6814603",
            "email": "asdf@asdf.com",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTM3ODcwOTd9.RGtB8D7UYo6H7s6iP-2XYYwSsmjXwYW5HryR8HkJePQ"
        }
    ],
    "upvotedBy": [
        {
            "userID": "51e19390-e5a2-11e7-a4e8-5333f6814603"
        }
    ],
    "downvotedBy": [
        {
            "userID": "685f3a60-e646-11e7-a4e2-8550bbcb6b20"
        },
        {
            "userID": "378da210-e59b-11e7-bf5e-55d794aba371"
        }
    ]
}
```

Users:
```json
{
    "_id": "e1267e10-e59a-11e7-bf5e-55d794aba371",
    "username": "john",
    "firstname": "John",
    "lastname": "Peterson",
    "description": "Really nice guy",
    "canton": "Bern",
    "country": "Switzerland",
    "email": "john@john.com",
    "website": "",
    "phone": "",
    "password": "$2a$10$7R2SXi6vMHTVqFjDDmtyeu6zxwo2p.K5VOmieTFFsjqT/1DcwPp0C",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTM3ODM5MDJ9.KMU6GScF2Yv0jF9U-bNprYZMnYs3-Ooz5ywhd33mkBY",
    "picture": "../images/default/male_w.png"
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
  
 
  
