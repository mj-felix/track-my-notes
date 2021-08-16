# TrackMyNotes by MJ Felix

![TrackMyNotes by MJ Felix](https://trackmynotes.mjfelix.dev/screenshot.jpg)

## Table of Contents

  - [Description](#description)
  - [Scope of Functionalities](#scope-of-functionalities)
    - [Pre-login](#pre-login)
    - [Post-login](#post-login)
  - [Technologies/Components](#technologiescomponents)
    - [Backend/APIs](#backendapis)
    - [Frontend](#frontend)
  - [Installation Notes](#installation-notes)
    - [Node.js](#nodejs)
    - [MongoDB](#mongodb)
    - [Environement Variables](#environement-variables)
      - [Minimum setup](#minimum-setup)
      - [Extended setup](#extended-setup)
    - [Install Dependecies](#install-dependencies)
    - [Run Application](#run-application)
    - [Test APIs](#test-apis)
  - [API Specification](#api-specification)
    - [Endpoint: /api/v1/auth](#endpoint-apiv1auth)
    - [Endpoint: /api/v1/users](#endpoint-apiv1users)
    - [Endpoint: /api/v1/tags](#endpoint-apiv1tags)
    - [Endpoint: /api/v1/notes](#endpoint-apiv1notes)
    - [Endpoint: /api/v1/notes/:id/files](#endpoint-apiv1notesidfiles)
    - [Endpoint: /api/v1/public/:profilename](#endpoint-apiv1publicprofilename)
  - [Contact](#contact)

## Description

Add your notes, tag them, upload attachments, and publish the ones you want the world to see.

Application is fully functional in production environment: [trackmynotes.mjfelix.dev](https://trackmynotes.mjfelix.dev)

## Scope of Functionalities

### Pre-login

- Login
- Registration
- See public profile
- See public notes
- See public note details

### Post-login

- See all notes
- Search notes by tag and/or keyword
- See note details
- Add note
- Tag note
- Untag note
- Update note
- Delete note
- Upload attachment to note
- Download attachment
- Delete attachment
- See all tags
- Add tag
- Update tag
- Delete tag
- See profile
- Update profile
- Update credentials

## Technologies/Components

Selection of components is inspired by the Udemy courses [React Front to Back](https://www.udemy.com/course/modern-react-front-to-back/) and [MERN eCommerce From Scratch](https://www.udemy.com/course/mern-ecommerce/) from [Bad Traversy](https://www.traversymedia.com). Application is using MERN stack and is deployed on Heroku.

### Backend/APIs

 - Node.js
 - Express.js
 - MongoDB Atlas (via mongoose.js)
 - Amazon Web Services (AWS) S3
 - JSON Web Token (JWT)
 - Mocha, Chai, supertest (for API testing)
 - Others ([see package.json](https://github.com/mj-felix/track-my-notes/blob/main/package.json))

### Frontend

 - React
 - Context API (for state management)
 - React Router
 - Bootstrap (via React Bootstrap and [Pulse theme from bootswatch.com](https://bootswatch.com/4/pulse/))
 - Others ([see package.json](https://github.com/mj-felix/track-my-notes/blob/main/frontend/package.json))

## Installation Notes

Below components are required to run the application locally (frontend app accessible via [localhost:3000](http://localhost:3000), APIs - via [localhost:5000](http://localhost:5000)):

### Node.js

Download installer from [the Node.js website](https://nodejs.org/en/download/) and follow the instructions.

### MongoDB

To install MongoDB Community Edition follow the instructions for your platform on [the offcial MongoDB website](https://docs.mongodb.com/manual/administration/install-community/).

### Environement Variables

#### Minimum setup
```
ADMIN_EMAIL=your email
```
This will allow to set the user as Admin when this email is used during registration. There is no specific functionality for Admin user at present.

```
JWT_SECRET=secret123
JWT_ACCESS_TOKEN_EXPIRES_IN=20m
JWT_REFRESH_TOKEN_EXPIRES_IN=8h
```
This will allow the backend app to generate JSON Web Token and set expiry time for access and refresh tokens.

#### Extended setup

**AWS S3 cloud storage** for uploaded files:
```
S3_ACCESS_KEY=key obtained from AWS S3
S3_ACCESS_SECRET=secret obtained from AWS S3
S3_BUCKET=track-my-notes-dev
```
For AWS S3 setup, go to [aws.amazon.com/s3](https://aws.amazon.com/s3/) and create an account. Once the account has been set up, navigate to the S3 services dashboard to create a new bucket with the name as above. Allow all public access while creating a bucket. Once the bucket has been created, go to Permissions tab and set Bucket policy to be:

    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicRead",
                "Effect": "Allow",
                "Principal": "*",
                "Action": [
                    "s3:GetObject",
                    "s3:GetObjectVersion"
                ],
                "Resource": "arn:aws:s3:::track-my-notes-dev/*"
            }
        ]
    }

To obtain access key and secret, open account dropdown and select “My Security Credentials”. Within the security credentials dashboard, open the “Access Keys” section and select “Create New Access Key.” This will generate the access key and secret for the application.

### Install Dependencies

```
npm install
cd frontend
npm install
```

### Run Application

```
# Run frontend (localhost:3000) and backend (localhost:5000 && with nodemon) concurrently
npm run dev

# Run backend only (with nodemon)
npm run server

# Run backend only (no nodemon)
npm start

# Run frontend only
npm run client
```

### Test APIs

To test APIs run `npm test` but be careful - this will erase the database before and after the test (it only connects to local instance of MongoDB).

Run `npx mocha test/*.test.js` if you do not wish the database to be erased before and after the test. Depending on the data present in the database at the time of running the test, some tests might fail due to data issues.

## API Specification

You can explore endpoints via [Postman collection](https://github.com/mj-felix/track-my-notes/tree/main/postman/backend_API).

### Endpoint: /api/v1/auth
```
@desc    Register a new user & obtain tokens
@route   POST /api/v1/auth/register
@access  Public

@desc    Authenticate user & obtain tokens
@route   POST /api/v1/auth/login
@access  Public

@desc    Obtain new access token
@route   GET /api/v1/auth/refreshaccesstoken
@access  Public
```

### Endpoint: /api/v1/users
```
@desc    Get logged in user profile
@route   GET /api/v1/users/profile
@access  Private

@desc    Update logged in user profile
@route   PUT /api/v1/users/profile
@access  Private
```

### Endpoint: /api/v1/tags
```
@desc    Get tags for logged in user
@route   GET /api/v1/tags
@access  Private
  
@desc    Create tag for logged in user
@route   POST /api/v1/tags
@access  Private

@desc    Update tag for logged in user
@route   PUT /api/v1/tags/:id
@access  Private

@desc    Delete tag for logged in user
@route   DELETE /api/v1/tags/:id
@access  Private
```

### Endpoint: /api/v1/notes
```
@desc    Get notes for logged in user
@route   GET /api/v1/notes
@params  ?pageSize=:pageSize
         &page=:pageNumber
         &search=:keyword
         &tags=:tagId1,:tagId2...
@access  Private

@desc    Create note for logged in user
@route   POST /api/v1/notes
@access  Private

@desc    Get note for logged in user
@route   GET /api/v1/notes/:id
@access  Private

@desc    Update note for logged in user
@route   PUT /api/v1/notes/:id
@access  Private

@desc    Delete note for logged in user
@route   DELETE /api/v1/notes/:id
@access  Private
```

### Endpoint: /api/v1/notes/:id/files
```
@desc    Upload file for a given note
@route   POST /api/v1/notes/:id/files
@access  Private

@desc    Delete file for a given note
@route   DELETE /api/v1/notes/:id/files/:storedFileName
@access  Private
```

### Endpoint: /api/v1/public/:profilename
```
@desc    Retrieve user public profile
@route   GET /api/v1/public/:profilename
@access  Public

@desc    Retrieve user's public notes
@route   GET /api/v1/public/:profilename/notes
@params  ?pageSize=:pageSize
         &page=:pageNumber
         &search=:keyword
         &tags=:tagId1,:tagId2...
@access  Public

@desc    Retrieve user's public note
@route   GET /api/v1/public/:profilename/notes/:noteid
@access  Public
```

## Contact

MJ Felix<br>
[mjfelix.dev](https://mjfelix.dev)<br>
mjfelixdev@gmail.com<br>
[linkedin.com/in/mszonline](https://www.linkedin.com/in/mjfelix/) ![Linkedin Profile](https://i.stack.imgur.com/gVE0j.png)
