FROM node:21

WORKDIR /app

ARG _VITE_SERVER_URL

ENV VITE_SERVER_URL=$_VITE_SERVER_URL

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]
