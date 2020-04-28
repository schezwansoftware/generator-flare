FROM node:10

WORKDIR /app


COPY . .
RUN npm config set registry http://registry.npmjs.org

RUN yarn install

RUN yarn build

EXPOSE <%= appPort %>

ENTRYPOINT ["node","./dist/main"]
