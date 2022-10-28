# NC-News

## Summary

This project was a solo back-end project of the Northcoders fullstack bootcamp, which utilises endpoints to retrieve data from a persistent data source.
It is written in Javascript, using node.js, express and PostgreSQL. Full test driven development (TDD) was included which utilised jest.

## Hosting

The Heroku hosted version of this project can be viewed [here](https://nc-news-proj.herokuapp.com/api)

## API

**To view all endpoints click [here](https://nc-news-proj.herokuapp.com/api)**

## Cloning the repository

1. Fork and clone this repository locally
2. Run `npm install` to install all the required dependancies
   > `As the .env\* files are added to the gitignore, these files can not be accessed locally when cloned.`
3. To connect to the database locally create 2 new files in the root directory named:
   1. **.env.development**
   2. **.env.test**
4. Within the new **.env.development** file you just created, connect the database by typing `PGDATABASE=<database_name>` in the file. Replace "database_name" with `nc_news`
5. Insert the same command in the .env.test file to connect to the test database, but replace "database_name" with `nc_news_test` instead
6. Run `npm run setup-dbs` to create two databases, for developement and testing.
7. Run `npm run seed` to seed the development database
8. Run `npm run prepare` to setup husky. Husky will not allow any commits or git actions if any tests fail.
9. Run `npm test` to run the entire test suite or `npm test <file_path>` to run a specific testing file.
10. Run `npm test app.test.js` to automatically run and seed the test database.
11. Run `npm run seed:prod` for deployment of Heroku.

## Versions

This project was developed using v18.4.0 of Node.js and 8.7.3 of Node Postgres.
