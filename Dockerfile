FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY dist ./dist

EXPOSE 3000

CMD ["npm", "start"]
