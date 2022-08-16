FROM node:16.15-alpine

RUN mkdir /app

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install

# Copy src
COPY . .

RUN npm run lint && npm run build && npm prune --production

CMD ["npm", "start"]