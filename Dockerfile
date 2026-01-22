# 1️⃣ Use lightweight Node.js image
FROM node:18-alpine

# 2️⃣ Set working directory inside the container
WORKDIR /app

# 3️⃣ Copy package.json and package-lock.json
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install --production

# 5️⃣ Copy the rest of the application code
COPY . .

# 6️⃣ Expose the port the service will run on
EXPOSE 8083

# 7️⃣ Start the application
CMD ["npm", "run", "dev"]
