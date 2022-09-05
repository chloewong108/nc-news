## NC News

As the .env\* files are added to the gitignore, these files can not be accessed locally when cloned.

## Instructions

1. Fork and clone the repo locally
2. Run `npm install` to download all of the required dependencies.
3. Create 2 files in the root directory named:

> **.env.development**

> **.env.test**

4. In the .env.development file connect the database by typing the command `PGDATABASE=<database_name>` (see set-up.sql file for the correct database name)
5. Insert the same command in the .env.test file to connect to the test database.
