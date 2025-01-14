FROM node:10-slim
WORKDIR /app
COPY . /app
RUN cd example/front \
  npm install \
  npm run build \
  cd - \
  npm install
COPY . /app
ENV RUN_ENV=docker NODE_ENV=production PORT=3005
EXPOSE 3005
CMD ["node", "index.js"]