# Groupread

Groupread is a website for hosting book discussions. Pick a book via OpenLibrary's API and Groupread will fill in the metadata and create a private discussion room. Groups are instanced, meaning no one can access your group without a direct link to it*. Each group is inextricably tied to one book, which emphasizes the frictionless group creation process and keeps discussion focused and on-topic.

*Note: the development version of the site has a public listing of all groups for ease of development and showcasing - the current plan is to remove the list in 1.0.

## Table of Contents

- [Developer notes](#developer-notes)

- [To do](#to-do)

  - [TypeScript roadmap](#typescript-roadmap)

- [How to run](#how-to-run)

## Developer notes

This has been my largest project by far, not least because I have challenged myself with new tools and techniques compared to previous projects. All my previous database work involved MongoDB, but for Groupread I branched out into Postgres, which led to replacing Mongoose with Sequelize. Sequelize is definitely more complex than Mongoose, and its docs are pretty bad. Particularly in the early stages of development, I had a lot of issues caused by poor documentation of basic functionality. I managed to hack it together with the help of random blog posts and StackOverflow pages, and now it's not too hard to work with.

On the frontend, I tried out the up-and-coming Bulma CSS framework, which I've found more visually pleasant and performant than Material or Semantic UI. This has also been my first significant experience with modals, which are used for the login/register form as well as the book metadata search popup. Bulma requires more manual coding to make modals work compared to other UI libraries, but I liked the increased customization it provides.

I also chose not to use create-react-app, if only to learn more about the internal workings of packaging web applications. This move had surprisingly few drawbacks - maybe five or six hours of total time configuring and troubleshooting with webpack and eslint. In the future I'll probably go with create-react-app again, because there also hasn't been much benefit in dropping it. It has been good to learn more about what create-react-app is doing in the background, anyway.

## To do

⭐ = priority level

- migrate to TypeScript (see below) ⭐⭐⭐

- ~~automated scheduling of discussion threads~~ ⭐⭐

- editing functionality for posts and comments ⭐⭐

- moderation tools for group owners ⭐⭐⭐

- ~~proper display of authors for books with multiple authors~~ ⭐

- custom URL support for book covers (OL has spotty coverage) ⭐

- address webpack warning about bundle size to improve loading performance ⭐

- proper frontend testing with Cypress ⭐⭐⭐

- ~~enhanced security (token expiration and validation, etc)~~ ⭐⭐⭐

### TypeScript roadmap

- ~~change frontend .js files to .tsx and make sure they build~~

- set up build process for backend to prepare for TypeScript conversion

  - rewrite validation code in ``/controllers`` to make full use of TypeScript

- ~~create the most obvious types (e.g. group data, user data)~~

  - share types across back- and frontend where appropriate

  - restructure so the repo root contains ``backend``, ``frontend``, and ``types`` folders

- refactor Redux and React Hook Form code to satisfy TypeScript

  - migrate fully to Redux Toolkit

## How to run

This project uses Yarn for scripts and package management. After cloning the repo, run ``yarn install`` to install dependencies. If you would rather use npm, delete ``yarn.lock`` and ``node_modules``, then run ``npm install``.

To compile and run a production build, run ``yarn start:full``. This creates a fresh build of the frontend and starts the server in production mode. (Or, if you want to do this in separate steps, run ``yarn build`` and then ``yarn start``.) You can access the production site at [http://localhost:3000/](http://localhost:3000/).

To run a development build, run ``yarn dev`` for the backend and ``yarn dev:ui`` for the frontend. The development frontend will be served at [http://localhost:3001/](http://localhost:3001/).

Other commands that may be of interest for development are ``yarn test`` and ``yarn lint``.
