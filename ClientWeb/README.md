# Boggle Game

This project is a dockerized client server application which allows users to play to Boggle

## Authors

[Charaf Lachachi](https://github.com/CharafLachachi) - Server written in OCaml

[Kaan Yagci](https://kaanyagci.com) - Front-end (UI written in Angular 6), Middleware (an ExpressJS HTTP server written in TypeScript, lets the Angular UI to a TCP server via web sockets. And handles some cases which were not handled by server), Dockerization (Which lets this application easy to use).

## Prerequisites

This project uses `docker-compose` for dockerization. You can install from [here](https://docs.docker.com/compose/install/) 

## Execution

To build the project run `docker-compose up --build` from project's root directory. 

## How to use ?

Once the execution is done. Connect to `http://localhost:1993` via your favorite internet browser to begin.
