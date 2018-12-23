# Event-messenger
# Проект находится в стадии разработки.
Для лого, что бы запустить проект локально, необходимо:
1. скачать, усстановить npm в корне и в папке mock, установить gulp;
2. сделать сборку командой в консоли: gulp build:mock;
3. запустить серврера: npm run server (порт 3003), npm run mock (порт 5006)
4. для того что бы войти, используйте любой из 10 логинов ботов (без пароля): 001, 002, 003..010

# Запустить сервeр и WebSocket Client
`npm run server`

open 2-n windows http://localhost:3003/ws/

Run backend server (with MongoDB)
`npm run backend`

Run mock server
`npm run mock`

# Компиляция для frontend developers 'mock':
`gulp watch`

# Компиляция для frontend developers 'live backend':
`gulp watch:server`

# Компиляция для frontend developers 'local server':
`gulp watch:localServer`

# Компиляция для live backend:
`gulp build:server`

# Компиляция для local server backend:
`gulp build:local`

# Установить
`npm install ws@3.3.2`
