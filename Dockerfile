
FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app/
EXPOSE 12525
CMD npm run watch