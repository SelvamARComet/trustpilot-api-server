FROM mcr.microsoft.com/playwright:v1.44.1-jammy

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

RUN npx playwright install

RUN chmod +x start.sh
CMD ["./start.sh"]