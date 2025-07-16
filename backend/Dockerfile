FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

# RUN npm install -g typescript && npm run build

EXPOSE 5000

CMD ["npm", "start"]
