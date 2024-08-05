# Mahasiswa Service

## Membuat akun mahasiswa (mahasiswa role)

Endpoint : POST /mahasiswa

Request Body :

```json
{
  "nama": "agung wibowo",
  "nim": "200103093",
  "no_hp": "+6281277000291",
  "pembimbing_akademik": "test",
  "password": "agung123",
  "email": "agungslaw@gmail.com"
}
```

Response Body Success :

```json
{
  "status": 200,
  "message": "Berhasil membuat akun mahasiswa",
  "data": {
    "id": "86611250-7ea5-4a92-8587-6d565d2975de",
    "nama": "agung wibowo",
    "nim": "2001030933",
    "no_hp": "+6281277000291",
    "pembimbing_akademik": "test",
    "username": "200103093",
    "password": "$2b$10$O6WSCgj4Y7BwwLeF2yCwyeFyTi8SqSAIz6oKl/LLN4qmwh5QcHXBS",
    "email": "agungslaw@gmail.com",
    "status": "active",
    "remember_token": "",
    "created_at": "2024-07-31T04:27:58.000Z",
    "update_at": "2024-07-31T04:27:58.000Z"
  },
  "refrence": null,
  "error": false
}
```

Response Body Error :

```json
{
  "status": 400,
  "message": "mahasiswa dengan nim 200103093 sudah ada",
  "data": null,
  "refrence": null,
  "error": true
}
```

## login mahasiswa (mahasiswa role)

Endpoint : POST /mahasiswa/login

Request Body :

```json
{
  "username": "200103093",
  "password": "agung123"
}
```

Response Body Success :

```json
{
  "status": 200,
  "message": "berhasil login",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNlMzU2MDVmLTlhYTktNDhkNS04YjNjLTdmZDc2NjE2ZDE1MiIsInJvbGUiOiJtYWhhc2lzd2EiLCJpYXQiOjE3MjI0MDAyMjQsImV4cCI6MTcyMzAwNTAyNH0.3Tlx3a4yIt9vS6__WRLOK4rwWqP4sUPF6pTnOHOGpVw"
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

## Verify access_token Mahasiswa (mahasiswa role)

Endpoint : GET /mahasiswa/token-verify

Headers :

- Authorization : Bearer access_token

Response Body Success :

```json
{
  "status": 200,
  "message": "access_token active",
  "data": {
    "id": "3e35605f-9aa9-48d5-8b3c-7fd76616d152",
    "role": "mahasiswa"
  },
  "refrence": null,
  "error": false
}
```

Responses Body Error :

```json
{
  "status": 400,
  "message": "tolong masukkan access_token valid",
  "data": null,
  "refrence": null,
  "error": true
}
```

## Mendapatkan informasi profile mahasiswa (mahasiswa role)

Endpoint : GET /mahasiswa/profile

Headers :

- Authorization : Bearer access_token

Response Body Success :

```json
{
  "status": 200,
  "message": "profil mahasiswa",
  "data": {
    "id": "3e35605f-9aa9-48d5-8b3c-7fd76616d152",
    "nama": "agung wibowo",
    "nim": "200103093",
    "no_hp": "+6281277000291",
    "pembimbing_akademik": "test",
    "username": "200103093",
    "email": "agungslaw@gmail.com",
    "status": "active"
  },
  "refrence": null,
  "error": false
}
```

## Mendapatkan informasin profile semua mahasiswa (kordinator role)

Endpoint : GET /mahasiswa

Headers :

- Authorization : Bearer access_token

Response Body Success :

```json
{
  "status": 200,
  "message": "list mahasiswa",
  "data": [
    {
      "id": "3e35605f-9aa9-48d5-8b3c-7fd76616d152",
      "nama": "agung wibowo",
      "nim": "200103093",
      "no_hp": "+6281277000291",
      "pembimbing_akademik": "test",
      "username": "200103093",
      "password": "$2b$10$DdapRbIwYAEfYSlis7oK9uA2497V8XSOWdAMrwCdt9tmHJlc6NUkO",
      "email": "agungslaw@gmail.com",
      "status": "active",
      "remember_token": "",
      "created_at": "2024-07-30T11:29:17.000Z",
      "update_at": "2024-07-30T11:29:17.000Z"
    },
    {
      "id": "86611250-7ea5-4a92-8587-6d565d2975de",
      "nama": "agung wibowo",
      "nim": "2001030933",
      "no_hp": "+6281277000291",
      "pembimbing_akademik": "test",
      "username": "2001030933",
      "password": "$2b$10$O6WSCgj4Y7BwwLeF2yCwyeFyTi8SqSAIz6oKl/LLN4qmwh5QcHXBS",
      "email": "agungslaw@gmail.com",
      "status": "active",
      "remember_token": "",
      "created_at": "2024-07-31T04:27:58.000Z",
      "update_at": "2024-07-31T04:27:58.000Z"
    }
  ],
  "refrence": null,
  "error": false
}
```
