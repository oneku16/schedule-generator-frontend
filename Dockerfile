FROM node:20-alpine

WORKDIR /app

# копируем package.json и package-lock.json
COPY package*.json ./

# устанавливаем зависимости
RUN npm install

# копируем оставшийся код
COPY . .

ENV PATH=/app/node_modules/.bin:$PATH

CMD ["npm", "run", "dev"]

