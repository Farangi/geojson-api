FROM node:16-alpine

# The directory where we will be working
WORKDIR /app

# Copy package.json to our container
# COPY package.json .
# COPY package-lock.json .
COPY . .
# Run the app on 3001
RUN npm install
# RUN npm install -g typescript
EXPOSE 3001
CMD [ "npm", "start" ]