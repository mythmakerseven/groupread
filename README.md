# Groupread

Groupread is a website for hosting book discussions. Pick a book via OpenLibrary's API and Groupread will fill in the metadata and create a private discussion room. Groups are instanced, meaning no one can access your group without a direct link to it*. Each group is inextricably tied to one book, which emphasizes the frictionless group creation process and keeps discussion focused and on-topic.

*Note: the development version of the site has a public listing of all groups for ease of development - this will be removed in 1.0

## Developer notes

This has been my largest project by far, not least because I have challenged myself with new tools and techniques compared to previous projects. All my previous database work involved MongoDB, but for Groupread I branched out into Postgres, which led to replacing Mongoose with Sequelize. Sequelize is definitely more complex than Mongoose, and its docs are pretty bad. Particularly in the early stages of development, I had a lot of issues caused by poor documentation of basic functionality. I managed to hack it together with the help of random blog posts and StackOverflow pages, and now it's not too hard to work with.

On the frontend, I tried out the up-and-coming Bulma CSS framework, which I've found more visually pleasant and performant than Material or Semantic UI. This has also been my first significant experience with modals, which are used for the login/register form as well as the book metadata search popup. Bulma requires more manual coding to make them work compared to other UI libraries, but I liked the increased customization it provides.

I also chose not to use create-react-app, if only to learn more about the internal workings of packaging web applications. This move had surprisingly few drawbacks - maybe five or six hours of total time configuring and troubleshooting with webpack and eslint. In the future I'll probably go with create-react-app again, because there also hasn't been much benefit in dropping it. It has been good to learn more about what create-react-app is doing in the background, anyway.

## To do

- ~~automated scheduling of discussion threads~~

- editing functionality for posts and comments

- archived mode for groups that have finished their reading schedule

- export group contents in a reasonable format (CSV, PDF, ?)

- reworked and simplified book selection process

- moderation tools for group owners

- proper display of authors for books with multiple authors (OL's API is tricky about this)

- custom URL support for book covers (OL has spotty coverage)

- ~~enhanced security (token expiration and validation, etc)~~

## How to run

This project uses Yarn for scripts and package management. After cloning the repo, run ``yarn install`` to install dependencies.

To compile and run a production build, run ``yarn start:full``. This creates a fresh build of the frontend and starts the server in production mode.

To run a development build, run ``yarn dev`` for the backend and ``yarn dev:ui`` for the frontend.

Other commands can be found in ``package.json``.
