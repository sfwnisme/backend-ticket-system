ARG NODE_VERSION=22.18.0

FROM node:${NODE_VERSION}-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD npm run server