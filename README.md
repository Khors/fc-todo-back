# FC Todo Backend

## Опис
Цей репозиторій містить серверну частину застосунку **Task Management**, створену на основі **Node.js** і **NestJS**.
Клієнт за посиланням https://github.com/Khors/fc-todo-front

## Вимоги
- **MySQL** для бази даних.
- **Node.js** для запуску сервера.

## Інструкції з встановлення

1. Клонувати репозиторій:
    ```
    git clone git@github.com:Khors/fc-todo-back.git
    ```
2. Перейти в папку репозиторія:
    ```
    cd fc-todo-back
    ```
3. Перейменувати `.example.env` у `.env`:
    ```
    mv .example.env .env
    ```
4. Внести свої креденшіали в `.env`.

5. Встановити залежності:
    ```
    npm install
    ```

## Команди для запуску

- Запуск у режимі розробки:
    ```
    npm run start:dev
    ```
- Запуск у production-режимі:
    ```
    npm run start:prod
    ```

## API Ендпоінти
- **GET /tasks** - Отримання списку всіх тасок.
- **POST /tasks** - Створення нової таски.
- **PATCH /tasks/:id/status** - Зміна статусу таски.
- **POST /tasks/:taskId/assign/:userId** - Додавання користувача до таски.
- **DELETE /tasks/:taskId/assign/:userId** - Видалення користувача з таски.
- **DELETE /tasks/:id** - Видалення таски.

## Технічна інформація
- **Node.js версія:** Переконайтеся, що у вас встановлена версія Node.js (мінімум 14.x).
- **База даних:** MySQL.
- **Файл конфігурації:** `.env` використовується для налаштування параметрів.

## Автор
Dmytro Burkovskyi