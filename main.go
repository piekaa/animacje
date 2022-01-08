package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	e := echo.New()
	e.Use(middleware.Recover())
	e.Static("/", "static")

	e.Logger.Fatal(e.Start(":6813"))
}

// todo jest jakiś bug w plikach, init z Animations zapisało się jako pierwszy z definitions, może jak się przełączy i coś tam zrobi to tak się dzieje

// todo definicje w podpowiedziach od razu, a nie po restarcie

// todo variable hints i type hints do jednego, potem dodać methodHints
