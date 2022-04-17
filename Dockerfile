FROM node:16-alpine3.11
WORKDIR /admin
COPY ./package.json /admin
RUN npm install
RUN npm config set unsafe-perm true
RUN chmod 777 /admin/node_modules
ENV CHOKIDAR_USEPOLLING=true
CMD ["npm", "start"]