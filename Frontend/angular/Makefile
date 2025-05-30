dev:
	@echo "inicializando modo de desarrollo"
	@ng serve

build:
	@docker build -t docker-angular .

up:
	@docker container run -dp 4200:80 docker-angular:latest

build-up:
	@make build
	@make up