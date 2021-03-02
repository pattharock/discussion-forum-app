# discussion-forum-app
A Full-Stack ExpressJS implementation of a Question Discussion Forum Platform.

## Requirements
 * NodeJS: "v12.18.0"
 * ExpressJS: "^4.17.1"
 * MongoDB: "MongoDB shell version v4.2.7"

## How to run locally

### Database

Run a local instance of MongoDb at PORT 27017. Launch the Mongo Interactive Shell and run the following commands.

1. `use KohraDB`

Creates and enters the database.

2. `db.createCollection("userRecord")`<br />
3. `db.createCollection("answerRecord")`<br />
4. `db.createCollection("questionRecord")`<br />

Creates the necessary MongoDB collections.

Thereafter, the Database can be popultated through the app itself. If needed, it may be prepopulated by following the set of instructions specified at `/data/MDBData.txt`


### Backend Server
1. Run `npm install` to install all dependencies. 
2. Thereafer, run `node index.js` to start the server at `localhost:8000`

### Frontend
1. Navigate to `localhost:8000`through browser of choice to access the application

