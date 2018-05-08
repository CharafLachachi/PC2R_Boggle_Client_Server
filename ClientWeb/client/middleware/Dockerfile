FROM node:latest

RUN npm install -g typescript 

RUN mkdir /client

WORKDIR /client

COPY ./package.json /client

RUN npm install

COPY . /client

EXPOSE 8746 

CMD [ "npm", "run", "start" ]