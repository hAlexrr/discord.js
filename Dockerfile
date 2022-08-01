FROM node:17.8.0
WORKDIR /usr/src/app

# Copy our source code into /usr/src/app
COPY package*.json ./
COPY src ./src/
COPY .env ./

RUN npm ci --only=production

CMD ["npm", "start"]