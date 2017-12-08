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

## DB Schema

The DB Schema should be build having the most frequent use cases in mind. Therefore the Schema should consist of one
collection - the activity - and the users interested in this activity will be added to it or removed from it. So when Peter
is interested in the activity running, with a regular single scan all users interested in this activity will be querried.
First simple Schema iteration (up to date with code).

```json
{
  "_id": "acitivity_id",
  "name": "name_of_activity",
  "description": "description_of_activity",
  "tags": "[tag_1, tag_2]",
  "popularity": "likes",
  "users": [{
    "user": "name",
    "description": "description_of_user"
  },{
    "user": "name",
    "description": "description_of_user"
  }]
}
```
## Working Routes

  > GET / -> some stub
  
  > GET /hello -> Hello World example for static page
  
  > GET /api/user/{name} -> stub for {name}'s public profile

  > GET /api/activities -> lists all activities in JSON format
  
  > GET /api/activities/{name} -> lists details of one activity in JSON format
    
  > POST /api/activities -> Creates new Document (payload must be in JSON) in activity collection