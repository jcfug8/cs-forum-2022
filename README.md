# cs-forum-2022

- npm init
- node install --save
  - express
  - mongoose
  - cors
- docker
  - docker run -d --name cs-forum-2022-mongo -e MONGO_INITDB_ROOT_USERNAME=user -e MONGO_INITDB_ROOT_PASSWORD=password -e MONGO_INITDB_DATABASE=cs-forum-2022 -p 27018:27017 -v $PWD/mongo-entrypoint/:/docker-entrypoint-initdb.d/ mongo

# API Reference

## List

List all of the threads in the database

### Method

- GET

### Path

- /forum

### Body Arguments

- N/A

### Success Code

- 200

### Error Codes

- 500 == Any Error

### Example Successful Return

```json
[
  {
    "_id": "60a480fbf9c872478ed3da2b",
    "user_id": "163480fbf9c872478ed3da98",
    "description": "cool description",
    "name": "The Name",
    "category": "Category Name",
    "createdAt": "2022-06-08T03:14:53.086Z",
    "updatedAt": "2022-06-08T03:14:53.086Z",
    "__v": 0,
    "user": {
      "_id": "163480fbf9c872478ed3da98",
      "username": "other@gmail.com",
      "fullname": "John Doe",
      "__v": 0
    }
  },
  {
    "_id": "jd9834jc8849cjf84830294j",
    "user_id": "908480fbf9c872478ed3d867",
    "description": "another cool description",
    "name": "The Name",
    "category": "Category Name",
    "createdAt": "2022-06-08T03:14:53.086Z",
    "updatedAt": "2022-06-08T03:14:53.086Z",
    "__v": 0,
    "user": {
      "_id": "908480fbf9c872478ed3d867",
      "username": "other@gmail.com",
      "fullname": "Jane Doe",
      "__v": 0
    }
  }
]
```

---

## Get

Get a specific thread

### Method

- GET

### Path

- /forum/{id}

### Body Arguments

- N/A

### Success Code

- 200

### Error Codes

- 404 == Not Found
- 500 == Any Other Error

### Example Successful Return

```json
{
  "_id": "60a480fbf9c872478ed3da2b",
  "user_id": "908480fbf9c872478ed3d867",
  "description": "cool description",
  "name": "The Name",
  "category": "Category Name",
  "createdAt": "2022-06-08T03:14:53.086Z",
  "updatedAt": "2022-06-08T03:14:53.086Z",
  "posts": [
    {
      "_id": "60a480fbf9c872478ed3da2b",
      "user_id": "8ea480fbf9c872478ed3d84c",
      "body": "The body of the post",
      "thread_id": "60a480fbf9c872478ed3da2b",
      "createdAt": "2022-06-08T03:14:53.086Z",
      "updatedAt": "2022-06-08T03:14:53.086Z",
      "user": {
      "_id": "8ea480fbf9c872478ed3d84c",
      "username": "other@gmail.com",
      "fullname": "John Doe",
      "__v": 0
      }
  }
    }
  ],
  "__v": 0,
  "user": {
      "_id": "908480fbf9c872478ed3d867",
      "username": "other@gmail.com",
      "fullname": "John Doe",
      "__v": 0
  }
},
```

---

## Create

Create a new thread. Any argument that is left out will default.

- Strings == `""`
- Boolean == `false`

### Method

- POST

### Path

- /thread/

### Body Arguments

```json
{
  "name": "",
  "category": "",
  "description": ""
}
```

### Success Code

- 201

### Error Codes

- 401 == Not Authenticated
- 500 == Any Error

### Example Successful Return

```json
{
  "_id": "60a480fbf9c872478ed3da2b",
  "user_id": "908480fbf9c872478ed3d867",
  "description": "cool description",
  "name": "The Name",
  "category": "Category Name",
  "createdAt": "2022-06-08T03:14:53.086Z",
  "updatedAt": "2022-06-08T03:14:53.086Z"
  "__v": 0
}
```

---

## Delete

Removes an existing forum and its posts.

### Method

- DELETE

### Path

- /forum/{id}

### Body Arguments

- N/A

### Success Code

- 200

### Error Codes

- 401 == Not Authenticated
- 403 == Not Authorized
- 404 == Not Found
- 500 == Any Other Error

### Example Successful Return

```json
{
  "_id": "60a480fbf9c872478ed3da2b",
  "user_id": "908480fbf9c872478ed3d867",
  "description": "cool description",
  "name": "The Name",
  "category": "Category Name",
  "createdAt": "2022-06-08T03:14:53.086Z",
  "updatedAt": "2022-06-08T03:14:53.086Z",
  "posts": [
    {
      "_id": "60a480fbf9c872478ed3da2b",
      "user_id": "8ea480fbf9c872478ed3d84c",
      "body": "The body of the post",
      "thread_id": "60a480fbf9c872478ed3da2b",
      "createdAt": "2022-06-08T03:14:53.086Z",
      "updatedAt": "2022-06-08T03:14:53.086Z"
    }
  ],
  "__v": 0
},
```

---

## Create

Create a new post. Any argument that is left out will default.

- Strings == `""`
- Boolean == `false`

### Method

- POST

### Path

- /thread/

### Body Arguments

```json
{
  "thread_id": "",
  "description": ""
}
```

### Success Code

- 201

### Error Codes

- 401 == Not Authenticated
- 500 == Any Error

### Example Successful Return

```json
{
  "_id": "60a480fbf9c872478ed3da2b",
  "user_id": "8ea480fbf9c872478ed3d84c",
  "body": "The body of the post",
  "thread_id": "60a480fbf9c872478ed3da2b",
  "createdAt": "2022-06-08T03:14:53.086Z",
  "updatedAt": "2022-06-08T03:14:53.086Z"
}
```

---

## Delete

Removes an existing posts.

### Method

- DELETE

### Path

- /thread/{thread_id}/post/{post_id}

### Body Arguments

- N/A

### Success Code

- 200

### Error Codes

- 401 == Not Authenticated
- 403 == Not Authorized
- 404 == Not Found
- 500 == Any Other Error

### Example Successful Return

```json
{
  "_id": "60a480fbf9c872478ed3da2b",
  "user_id": "8ea480fbf9c872478ed3d84c",
  "body": "The body of the post",
  "thread_id": "60a480fbf9c872478ed3da2b",
  "createdAt": "2022-06-08T03:14:53.086Z",
  "updatedAt": "2022-06-08T03:14:53.086Z"
}
```

---

## Create New Session (authenticate)

Authenticates.

### Method

- POST

### Path

- /session

### Body Arguments

```json
{
  "username": "",
  "password": ""
}
```

### Success Code

- 201

### Error Codes

- 401 == Not Authenticated

### Example Successful Return

---

## Get If Authenticated

Authenticates.

### Method

- GET

### Path

- /session

### Body Arguments

- N/A

### Success Code

- 200

### Error Codes

- 401 == Not Authenticated

### Example Successful Return

---

## Create

Create a user.

### Method

- POST

### Path

- /user/

### Body Arguments

```json
{
  "username": "",
  "password": "",
  "full_name": ""
}
```

### Success Code

- 201

### Error Codes

- 500 == Any Error

### Example Successful Return

```json
{
  "_id": "62b70f66f4dae754a38ccc9c",
  "username": "other@gmail.com",
  "fullname": "John Doe",
  "password": "pass",
  "__v": 0
}
```
