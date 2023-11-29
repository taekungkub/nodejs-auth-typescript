# production

FROM node:20
ENV NODE_ENV=production
WORKDIR /app
COPY package\*.json ./
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 8000
RUN chown -R node /app
USER node
CMD ["npm", "start"]

# dev

FROM node:20

WORKDIR /app

COPY package\*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]
