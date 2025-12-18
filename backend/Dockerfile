FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm install -g ts-node-dev typescript tsconfig-paths

EXPOSE 5000

CMD ["npm", "run", "dev"]
