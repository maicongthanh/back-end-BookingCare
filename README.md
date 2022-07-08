Back end for BookingCare app
This is back-end server

It set up CORS for client app
http://localhost:3000

STEP 1 : CLONE project
STEP 2 : CREATE new DB in MySQL
    - Name of Database : bookingcare
STEP 3 : Install sequelize cli
STEP 4 : Run npx sequelize-cli db:migrate
STEP 5 : Create file .env with:
    PORT=8080
    NODE_ENV=development
    URL_REACT=http://localhost:3000
    MAX_NUMBER_SCHEDULE = 10

    -- You must create an email app to send emails --

    EMAIL_APP_PASSWORD= Your email password 
    EMAIL_APP= Your email
STEP 5 : npm start