https://medium.com/@ajaysikdar/deploy-reactjs-app-with-nodejs-server-on-google-app-engine-f862c81457de
https://www.codingdeft.com/posts/react-deploy-google-cloud-app-engine/
https://viblo.asia/p/deploy-react-app-len-aws-s3-OeVKB8xQlkW

# ProShop eCommerce Platform

> eCommerce platform built with the MERN stack & Redux.

This is the course project for my [MERN eCommerce From Scratch](https://www.udemy.com/course/mern-ecommerce) course

![screenshot](https://github.com/bradtraversy/proshop_mern/blob/master/uploads/Screen%20Shot%202020-09-29%20at%205.50.52%20PM.png)

## Features

- Full featured shopping cart
- Product reviews and ratings
- Top products carousel
- Product pagination
- Product search feature
- User profile with orders
- Admin product management
- Admin user management
- Admin Order details page
- Mark orders as delivered option
- Checkout process (shipping, payment method, etc)
- PayPal / credit card integration
- Database seeder (products & users)

## Note on Issues
Please do not post issues here that are related to your own code when taking the course. Add those in the Udemy Q/A. If you clone THIS repo and there are issues, then you can submit

## Usage

### ES Modules in Node

We use ECMAScript Modules in the backend in this project. Be sure to have at least Node v14.6+ or you will need to add the "--experimental-modules" flag.

Also, when importing a file (not a package), be sure to add .js at the end or you will get a "module not found" error

You can also install and setup Babel if you would like

### Env Variables

Create a .env file in then root and add the following

Open terminal and run `openssl rand -hex 64` to generate 512-bit secret key 

```
NODE_ENV = development
PORT = 5000
MONGO_URI = your mongodb uri
JWT_SECRET = 'abc123'
PAYPAL_CLIENT_ID = your paypal client id
```

### Install Dependencies (frontend & backend)

```
npm install
cd frontend
npm install
```

### Run

```
# Start MongoDB
mongod --dbpath /home/andd/apps/workspace/studying/React/mongo --logpath /home/andd/apps/workspace/studying/React/log/mongodb/mongod.log --bind_ip 0.0.0.0 --auth --fork

# Run frontend (:3000) & backend (:5000)
npm run dev

# Run backend only
npm run server
```

## Build & Deploy

```
# Create frontend prod build
cd frontend
npm run build
```

There is a Heroku postbuild script, so if you push to Heroku, no need to build manually for deployment to Heroku
 
### Deploy to Google Cloud App Engine from Google Source Repo using Google Cloud Build
1. Create Google Cloud Source Repository
2. Grant the necessary permissions the Cloud Build service account (The permission to 'fetch' the application, and the permission to 'deploy' the application)
3. Config the cloudbuild.yaml
4. Config the app.yaml
   - Create a Secret on Google Cloud Console 'Secrets Manager' if necessary
5. Create trigger and the project want to use Cloud Build
6. Add the GCS Repo to your current project if it's exist using: `git remote add google <GCSR_REPO_URL>`
   - To get your GCS Repo URL use this command: `gcloud source repos describe <REPO_NAME> --format="value(url)"`
7. Push the project to GCS Repo using: `git push google master`

### Seed Database

You can use the following commands to seed the database with some sample users and products as well as destroy all data

```
# Import data
npm run data:import

# Destroy data
npm run data:destroy
```

```
Sample User Logins

admin@example.com (Admin)
123456

john@example.com (Customer)
123456

jane@example.com (Customer)
123456
```


## License

The MIT License

Copyright (c) 2020 Traversy Media https://traversymedia.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
