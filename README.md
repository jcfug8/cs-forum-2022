# cs-forum-2021

- npm init
- node install --save
  - express
  - mongoose
- docker
  - docker run -d --name cs-forum-2021-mongo -e MONGO_INITDB_ROOT_USERNAME=user -e MONGO_INITDB_ROOT_PASSWORD=password -e MONGO_INITDB_DATABASE=cs-forum-2021 -p 27018:27017 -v $PWD/mongo-entrypoint/:/docker-entrypoint-initdb.d/ mongo

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
    "author": "Kevin",
    "description": "cool description",
    "name": "The Name",
    "createdAt": "2021-06-08T03:14:53.086Z",
    "updatedAt": "2021-06-08T03:14:53.086Z",
    "__v": 0
  },
  {
    "_id": "jd9834jc8849cjf84830294j",
    "author": "Stacy",
    "description": "another cool description",
    "name": "The Name",
    "createdAt": "2021-06-08T03:14:53.086Z",
    "updatedAt": "2021-06-08T03:14:53.086Z",
    "__v": 0
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
  "author": "Kevin",
  "description": "cool description",
  "name": "The Name",
  "createdAt": "2021-06-08T03:14:53.086Z",
  "updatedAt": "2021-06-08T03:14:53.086Z",
  "posts": [
    {
      "_id": "60a480fbf9c872478ed3da2b",
      "author": "Kyle",
      "body": "The body of the post",
      "thread_id": "60a480fbf9c872478ed3da2b",
      "createdAt": "2021-06-08T03:14:53.086Z",
      "updatedAt": "2021-06-08T03:14:53.086Z"
    }
  ],
  "__v": 0
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
  "description": "",
  "author": ""
}
```

### Success Code

- 201

### Error Codes

- 500 == Any Error

### Example Successful Return

```json
{
  "_id": "60a480fbf9c872478ed3da2b",
  "author": "Kevin",
  "description": "cool description",
  "name": "The Name",
  "createdAt": "2021-06-08T03:14:53.086Z",
  "updatedAt": "2021-06-08T03:14:53.086Z"
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

- 404 == Not Found
- 500 == Any Other Error

### Example Successful Return

```json
{
  "_id": "60a480fbf9c872478ed3da2b",
  "author": "Kevin",
  "description": "cool description",
  "name": "The Name",
  "createdAt": "2021-06-08T03:14:53.086Z",
  "updatedAt": "2021-06-08T03:14:53.086Z",
  "posts": [
    {
      "_id": "60a480fbf9c872478ed3da2b",
      "author": "Kyle",
      "body": "The body of the post",
      "thread_id": "60a480fbf9c872478ed3da2b",
      "createdAt": "2021-06-08T03:14:53.086Z",
      "updatedAt": "2021-06-08T03:14:53.086Z"
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
  "description": "",
  "author": ""
}
```

### Success Code

- 201

### Error Codes

- 500 == Any Error

### Example Successful Return

```json
{
  "_id": "60a480fbf9c872478ed3da2b",
  "author": "Kyle",
  "body": "The body of the post",
  "thread_id": "60a480fbf9c872478ed3da2b",
  "createdAt": "2021-06-08T03:14:53.086Z",
  "updatedAt": "2021-06-08T03:14:53.086Z"
}
```

---

## Delete

Removes an existing posts.

### Method

- DELETE

### Path

- /forum/{thread_id}/{post_id}

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
  "author": "Kyle",
  "body": "The body of the post",
  "thread_id": "60a480fbf9c872478ed3da2b",
  "createdAt": "2021-06-08T03:14:53.086Z",
  "updatedAt": "2021-06-08T03:14:53.086Z"
}
```
