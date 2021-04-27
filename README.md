# Groupread - Self-hosted reading groups

Groupread is a **self-hostable** platform for hosting book discussions.

Pick a book via OpenLibrary's API and Groupread will fill in the metadata and create a discussion group. Each group is inextricably tied to one book, which emphasizes the frictionless group creation process and keeps discussion focused and on-topic.

A demo server is available at [http://gr.camdenmecklem.com/](http://gr.camdenmecklem.com/).

## Table of Contents

- [Self-hosting](#self-hosting)

- [Contributing](#contributing)

- [To do](#to-do)

  - [TypeScript roadmap](#typescript-roadmap)

- [Developer notes](#developer-notes)

## Self-hosting

To self-host, you will need:

- The Yarn package manager

- A database of any kind supported by [Sequelize](https://sequelize.org/)

For now, Groupread combines the backend and frontend into a single repository. This may change in the future.

To begin, ``git clone`` the repo into your desired location.

First, pick a database. Groupread uses the Sequelize ORM, which supports Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server, but requires a driver package for the chosen database. By default, Groupread includes the ``pg`` and ``pg-hstore`` packages for Postgres support. If you wish to connect to another supported database, you must add the required driver ([detailed here](https://sequelize.org/master/manual/getting-started.html#installing)) to ``package.json``.

Now you can run ``yarn install`` to install dependencies.

The server expects the following environment variables:

- **DB_URL**: the URL to the database you plan to use. The tables will automatically be created on first run.

- **TEST_DB_URL**: the URL to the database used for running tests. **Warning**: This database is repeatedly wiped during tests. Do not use the same one that you used above.

- **SECRET**: bcrypt's secret parameter, used for generating secure tokens. Use a long, random string.

- **PORT**: the port on which the server will run.

Before launching, you might want to run the test suite to make sure everything works. ``yarn test:jest`` will run the backend unit tests, and ``yarn test:component`` will run frontend component tests. Note that test coverage is not great right now, with the frontend tests in particular being a work in progress.

Now you can run ``yarn start:full`` to build and serve a production-ready app. The site will be hosted locally, e.g. at [http://localhost:3000/](http://localhost:3000/) if you set ``PORT`` to 3000.

## Contributing

This project welcomes contributions.

You can host a live server on your local machine to make development easier. After cloning the repo and running ``yarn install``, start the development backend server with ``yarn dev`` and the frontend development server with ``yarn dev:ui``. The frontend will be served at [http://localhost:3001/](http://localhost:3001/).

If you plan to work on new functionality, please file an issue first so no one duplicates your efforts.

Before submitting a pull request, make sure to lint your code with ``yarn lint`` and test with both ``yarn test:jest`` and ``yarn test:component``. Code style isn't very strict right now beyond the basic linting rules, although more stringency might be enforced in the future.

## To do

⭐ = priority level

- migrate to TypeScript (see below) ⭐⭐⭐

- moderation tools for group owners ⭐⭐⭐

- proper frontend testing with Cypress ⭐⭐⭐

- ~~enhanced security (token expiration and validation, etc)~~ ⭐⭐⭐

- ~~automated scheduling of discussion threads~~ ⭐⭐

- editing functionality for posts and comments ⭐⭐

- ~~proper display of authors for books with multiple authors~~ ⭐

- custom URL support for book covers (OL has spotty coverage) ⭐

- address webpack warning about bundle size to improve loading performance ⭐

- Docker container for easier self-hosting ⭐

- logo ⭐

### TypeScript roadmap

- ~~change frontend .js files to .tsx and make sure they build~~

- set up build process for backend to prepare for TypeScript conversion

  - rewrite validation code in ``/controllers`` to make full use of TypeScript

- ~~create the most obvious types (e.g. group data, user data)~~

  - share types across back- and frontend where appropriate

  - restructure so the repo root contains ``backend``, ``frontend``, and ``types`` folders

- ~~refactor Redux and React Hook Form code to satisfy TypeScript~~

  - ~~migrate fully to Redux Toolkit~~

## Developer notes

This has been my largest project by far, not least because I have challenged myself with new tools and techniques compared to previous projects. All my previous database work involved MongoDB, but for Groupread I branched out into Postgres, which led to replacing Mongoose with Sequelize. Sequelize is definitely more complex than Mongoose, and its docs are pretty bad. Particularly in the early stages of development, I had a lot of issues caused by poor documentation of basic functionality. I managed to hack it together with the help of random blog posts and StackOverflow pages, and now it's not too hard to work with.

On the frontend, I tried out the up-and-coming Bulma CSS framework, which I've found more visually pleasant and performant than Material or Semantic UI. This has also been my first significant experience with modals, which are used for the login/register form as well as the book metadata search popup. Bulma requires more manual coding to make modals work compared to other UI libraries, but I liked the increased customization it provides.

I also chose not to use create-react-app, if only to learn more about the internal workings of packaging web applications. This move had surprisingly few drawbacks - maybe five or six hours of total time configuring and troubleshooting with webpack and eslint. In the future I'll probably go with create-react-app again, because there also hasn't been much benefit in dropping it. It has been good to learn more about what create-react-app is doing in the background, anyway.

When I began working on Groupread, I had no significant experience with TypeScript. Since then, I've become much more comfortable working with it, so I use it for new code and I'm gradually adding making use of TypeScript features for old code. Types should strengthen data validation and simplify the backend code. I've already caught frontend bugs thanks to TypeScript error messages.
