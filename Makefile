dev:
	npm run start:dev

db:
	docker compose up -d

build:
	docker build -t miniotl-prod .

run:
	docker run -p3000:3000 --rm -it --name miniotl-container miniotl-prod

stop:
	docker stop miniotl-container

kill:
	docker kill miniotl-container