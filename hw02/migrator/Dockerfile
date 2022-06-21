FROM node:16.15-alpine

RUN mkdir /app

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install

# Copy src
COPY . .

RUN npm prune --production
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT /app/entrypoint.sh