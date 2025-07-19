# Use official Node.js image with Puppeteer dependencies
FROM node:20-slim

# Install necessary dependencies for Puppeteer to run Chromium
RUN apt-get update && apt-get install -y     wget     ca-certificates     fonts-liberation     libappindicator3-1     libasound2     libatk-bridge2.0-0     libatk1.0-0     libcups2     libdbus-1-3     libgdk-pixbuf2.0-0     libnspr4     libnss3     libx11-xcb1     libxcomposite1     libxdamage1     libxrandr2     xdg-utils     --no-install-recommends &&     apt-get clean &&     rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Set environment variable for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Install Puppeteer manually so it can use system Chromium
RUN npm install puppeteer

# Expose app port
EXPOSE 3000

# Run the application
CMD [ "node", "index.js" ]
