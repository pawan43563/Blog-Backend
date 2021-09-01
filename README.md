



<br />

  <h1>Blog Endpoints</h1>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
      	<li><a href="#before-you-begin">Before You Begin</a></li>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
       <li><a href="#run">Run</a></li>
      </ul>
    </li>
    <li>
    <a href="#routes">Routes</a>
      <ul>
    	<li><a href="#user-route">User Routes</a></li>
    	<li><a href="#blog-route">Blog Routes</a></li>
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#future-scope">Future Scope</a></li>
    <li><a href="#postman">Run it on Postman</a></li>
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#references">References</a></li>
   <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

A Blog backend made using [Nodejs](https://nodejs.org/en/) and [Mongodb Atlas](https://docs.atlas.mongodb.com/)



<!-- GETTING STARTED -->
## Getting Started
## Before You Begin
Before you begin  read about the below topics .
* Express - The best way to understand express is through its [Official Website](http://expressjs.com/).
* Node.js - Read Documentation to get better understanding [Node.js Official Website](http://nodejs.org/).
* Mongodb - Read Documentation to get better understanding [Mongodb Official Website](https://docs.mongodb.com/)

### Prerequisites

Make sure you have installed all of the following prerequisites on your machine:

* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. 
* Postman - [Download & Install Postman](https://www.postman.com/downloads/) . 
* Mongodb Atlas - Make sure you have account on mongodb atlas so you can use your own url and data will be store accordinly.

### Installation


1. Clone the repo
   ```
   git clone https://github.com/pawan43563/TodolistBackend.git
   ```
2. Create config.env file inside your root folder.
    ```
    PORT = port number 
    MODE = PRODUCTION // if you want to see error stack than write development
    DB_LOCAL = your mongodb url
    IMAGE_STORAGE_TYPE = LOCAL // if you want to store it in cloud write CLOUD
    SECRET = your secret key for jwt authentication
    CLOUDINARY_CLOUD_NAME = your cloudinary cloud name
    CLOUDINARY_API_KEY = your cloudinary api key
    CLOUDINARY_API_SECRET = your cloudinary api secret
    CLOUDINARY_URL_PATH = your url path // image in database is only storing publicid you can access it by appending it to this path 
    ```
3. Install NPM packages
   ```
   npm install
   ```
### Run the project
   ```
   node server.js
   ```

## Routes

### User Routes


**GET** 
Request on /users will give all the users

```
/users
```

**POST** 
Request on /users/register with valid request body will create new user.

```
/users/login
```


**POST** 
Request on /users/login with valid request body will give all the users

```
/users/login
```
On successfull request token will be given. we will be using this token to access private routes

### Blog Routes


**GET** (Public Route)
Request on /blogs will return all the blogs.

```
/blogs
```

**GET** (Public Route)
Request on /blogs with specified id will give a specific blog which has a same id.

```
/blogs/:id
```

**GET** (Public Route)
Request on /blogs with valid query will give blog based on query.
* You can get all the blogs of a particular user by querying userId

```
/blogs?author=pawan&title=django
```

**POST** (Private Route)
Request on /blogs with valid request body will create new blog.
* Add Authorization in headers and put value <Bearer your_token> which you got during login.
```
/blogs
```

**PATCH**(Private Route)
Request on /blogs with specified id and valid request body will update blog.
* Add Authorization in headers and put value <Bearer your_token> which you got during login.
```
/blogs/:id
```
**DELETE**(Private Route)
Request on /blogs with specified id will delete blog.
* Add Authorization in headers and put value <Bearer your_token> which you got during login.
```
/blogs/:id
```


	
### features

1. Each User can have their own blog and only they will be able to update, delete it.
2. JWT Tokens to authenticate user.
2. Image Adapter = User can save data to cloud or in their local system based on mode selected .
3. In development mode error stack will be shown while in production only relevant error will be shown to the user.


	


### Project Structure

```
├─ .gitignore
├─ README.md
├─ app.js
├─ config
│  └─ cloudinaryConfig.js
├─ config.env
├─ controllers
│  ├─ blogController.js
│  └─ userController.js
├─ images
├─ middlewares
│  ├─ authvalidation.js
│  ├─ imageupload.js
│  └─ requestvalidation.js
├─ models
│  ├─ blogModel.js
│  └─ userModel.js
├─ package-lock.json
├─ package.json
├─ routes
│  ├─ blogRouter.js
│  └─ userRouter.js
├─ server.js
└─ utils
   ├─ errorHandling.js
   └─ sendResponse.js
```



### Future Scope

1. Refresh Tokens.
2. Frontend.


### Postman

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/collections/fab8719c06382c604a6e)

### Deployment
Backend:
[Heroku](https://polar-woodland-07461.herokuapp.com/)

Frontend:
[Github Live Link](https://pawan43563.github.io/Todolist-Frontend-/)
[Netlify Live Link](https://naughty-minsky-ced17d.netlify.app/)

<!-- CONTACT -->
## Contact

Pawan Sharma - pawan.ps43563@gmail.com
