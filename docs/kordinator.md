# Kordinator service

## Membuat Akun Kordinator

Endpoint : POST /kordinators

Request Body :

```json
{
  "nama": "testing",
  "no_hp": "123412341234",
  "nidn": "123412341234",
  "jabatan": "kaprodi",
  "password": "testing",
  "email": "example@gmail.com",
  "secret": "UMRIHEBAT123" // required
}
```

Response Body Success :

```json
{
  "status": 200,
  "message": "berhasil membuat akun kordinator",
  "data": {
    "id": "81ced156-8123-45c9-8f5b-cf2ec8d26959",
    "nama": "testing",
    "no_hp": "123412341234",
    "nidn": "1234123412345",
    "jabatan": "kaprodi",
    "username": "1234123412345",
    "password": "$2b$10$FCOFqNFizQ8budtAYntgO.V5VMKqoa1Mf3A8Qedg9iDg89PrqP6X2",
    "email": "example@gmail.com",
    "status": "active",
    "remember_token": "",
    "created_at": "2024-07-30T03:29:53.000Z",
    "update_at": "2024-07-30T03:29:53.000Z"
  },
  "refrence": "/kordinator/login",
  "error": false
}
```

Response Body Error :

```json
{
  "status": 400,
  "message": "nidn 1234123412345 sudah ada sebagai kordinator",
  "data": null,
  "refrence": null,
  "error": true
}
```

## Login Kordinator

Endpoint : POST /kordinators/login

Request Body :

```json
{
  "username": "testing",
  "password": "testing"
}
```

Response Body Success :

```json
{
  "status": 200,
  "message": "berhasil login",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInRd5cCI6IkpXVCJ9.eyJpZCI6IjQ2NmY1YjM1LTRlYmQtNDc0Mi04MzEdwLWUxNjBlOWZlODc5NiIsInJvbGUiOiJrb3JkaW5hdG9yIiwiaWF0IjoxNzIyMzM1NzE0LCJleHAiOjE3MjI5NDA1MTR9.hesSF2bBOur9Xm3lvnNbVAqEdfpLLy_FXPrPPjg8_luM"
  },
  "refrence": null,
  "error": false
}
```

Response Body Error :

```json
{
  "status": 400,
  "message": "username atau password salah!",
  "data": null,
  "refrence": null,
  "error": true
}
```

## Verify access_token Kordinator

Endpoint : GET /kordinators/token-verify

Headers :

- Authorization : Bearer access_token

Response Body Success :

```json
{
  "status": 200,
  "message": "access_token active",
  "data": {
    "id": "466f5b35-4ebd-4742-8310-e160e9fe8796",
    "role": "kordinator"
  },
  "refrence": null,
  "error": false
}
```

Response Body Error :

```json
{
  "status": 400,
  "message": "tolong masukkan access_token valid",
  "data": null,
  "refrence": null,
  "error": true
}
```

## Mendapatkan Informasin Profile

Endpoint : GET /kordinators/profile

Headers :

- Authorization : Bearer access_token

Response Body Success :

```json
{
  "status": 200,
  "message": "profile",
  "data": {
    "id": "466f5b35-4ebd-4742-8310-e160e9fe8796",
    "nama": "anonymous",
    "no_hp": "082377446633",
    "nidn": "123412341234",
    "jabatan": "kaprodi",
    "username": "123412341234",
    "email": "example@gmail.com",
    "status": "active",
    "remember_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ2NmY1YjM1LTRlYmQtNDc0Mi04MzEwLWUxNjBlOWZlODc5NiIsInJvbGUiOiJrb3JkaW5hdG9yIiwiaWF0IjoxNzIyMzM1NzE0LCJleHAiOjE3MjI5NDA1MTR9.hesSF2bBOur9Xm3lvnNbVAqEfpLLy_FXPrPPjg8_luM"
  },
  "refrence": null,
  "error": false
}
```

## Mendapatkan Informasi Semua Kordinator

Endpoint : GET /kordinators

Headers:

-Authorization : Bearer access_token

Response Body Success :

```json
{
  "status": 200,
  "message": "kordinators",
  "data": [
    {
      "id": "466f5b35-4ebd-4742-8310-e160e9fe8796",
      "nama": "anonymous",
      "no_hp": "082377446633",
      "nidn": "123412341234",
      "jabatan": "kaprodi",
      "username": "123412341234",
      "email": "example@gmail.com",
      "status": "active",
      "remember_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ2NmY1YjM1LTRlYmQtNDc0Mi04MzEwLWUxNjBlOWZlODc5NiIsInJvbGUiOiJrb3JkaW5hdG9yIiwiaWF0IjoxNzIyMzM1NzE0LCJleHAiOjE3MjI5NDA1MTR9.hesSF2bBOur9Xm3lvnNbVAqEfpLLy_FXPrPPjg8_luM"
    },
    {
      "id": "81ced156-8123-45c9-8f5b-cf2ec8d26959",
      "nama": "testing",
      "no_hp": "123412341234",
      "nidn": "1234123412345",
      "jabatan": "kaprodi",
      "username": "1234123412345",
      "email": "example@gmail.com",
      "status": "active",
      "remember_token": ""
    }
  ],
  "refrence": null,
  "error": false
}
```
