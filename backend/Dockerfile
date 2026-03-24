FROM node:22

WORKDIR /usr/src/app

ENV NODE_ENV=development

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]