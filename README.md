# cs-forum-2021

- npm init
- node install --save
  - express
  - mongoose
- docker
  - docker run -d --name cs-forum-2021-mongo -e MONGO_INITDB_ROOT_USERNAME=user -e MONGO_INITDB_ROOT_PASSWORD=password -e MONGO_INITDB_DATABASE=cs-forum-2021 -p 27017:27017 -v $PWD/mongo-entrypoint/:/docker-entrypoint-initdb.d/ mongo
