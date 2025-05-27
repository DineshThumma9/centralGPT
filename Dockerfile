FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173 5174 5175

# Use environment variable or default to 5173
CMD ["sh", "-c", "npm run dev -- --port ${PORT:-5173}"]
