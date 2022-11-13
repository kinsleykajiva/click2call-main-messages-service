FROM node:16-alpine

RUN npm install -g nodemon

WORKDIR /app

ENV DEV_NODE_ENVIROMMENT=production
ENV MAIN_API_URL https://api-app.xxxxxxxxxxxxxxx.com

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4500
ENTRYPOINT ["nodemon" ,"./bin/www"]