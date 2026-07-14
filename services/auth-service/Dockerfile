FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

CMD ["node", "src/server.js"]