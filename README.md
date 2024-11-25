# Northcoders News API

For instructions, please head over to [L2C NC News](https://l2c.northcoders.com/courses/be/nc-news).

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

___

Setting Up Environment Variables

To run this project locally, you need to create two environment variable files, .env.test and .env.development, in the root of your project directory. These files will contain the database names required to connect to the respective environments.

Steps to Create Environment Variable Files:

	1.	Create a .env.test file with the following content:

    PGDATABASE=nc_news_test

    2.	Create a .env.development file with the following content:

    PGDATABASE=nc_news

    3.	Ensure that these files are not tracked by Git by verifying they are included in your .gitignore. The .gitignore should include the following entry:

    .env.*

Note:

Since .env files are .gitignored, they will not be included when cloning the repository. Anyone wishing to clone and run this project locally must create these files manually based on the instructions above.