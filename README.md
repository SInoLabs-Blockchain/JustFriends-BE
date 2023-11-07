# JustFriends-BE

JustFriends-BE is a backend service for the JustFriends application.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed the latest version of Node.js and npm.
* You have a Windows/Linux/Mac machine.

## Installing JustFriends-BE

To install JustFriends-BE, follow these steps:

1. Clone the repository: `git clone https://github.com/yourusername/JustFriends-BE.git`
2. Navigate into the project directory: `cd JustFriends-BE`
3. Install the dependencies: `npm install`

## Configuring JustFriends-BE

JustFriends-BE requires the following environment variables:

* `DATABASE_URL`: The connection string for your PostgreSQL database.
* `PORT`: The port on which the server should run.
* `SECRET_KEY`: The secret key for signing JWT tokens.

You can set these variables in a `.env` file in the root of your project. For example:

DATABASE_URL=postgres://myuser:mypassword@localhost:5432/mydb 
PORT=3000 
SECRET_KEY=mysecretkey


## Running JustFriends-BE

To run JustFriends-BE, follow these steps:

1. Start the server: `npm start`
2. The server should now be running at `http://localhost:3000`.

## Contact

If you want to contact me you can reach me at `<trongdatle249@gmail.com>`.

## License

This project uses the following license: `<MIT>`.