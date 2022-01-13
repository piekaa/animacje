package main

import (
	"bytes"
	"fmt"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"os"
	"time"
)

func main() {
	e := echo.New()
	e.Use(middleware.Recover())
	e.Static("/", "static")

	e.POST("backup/:name", Backup)

	e.Logger.Fatal(e.Start(":6813"))
}

func Backup(c echo.Context) error {
	name := c.Param("name")
	buffer := new(bytes.Buffer)
	buffer.ReadFrom(c.Request().Body)
	bodyString := buffer.String()
	t := time.Now().Unix() / 60
	os.WriteFile(fmt.Sprintf("backup/%s%d.json", name, t), []byte(bodyString), 777)
	return c.String(200, "")
}

// todo jest jakiś bug w plikach, init z Animations zapisało się jako pierwszy z definitions, może jak się przełączy i coś tam zrobi to tak się dzieje

// todo definicje w podpowiedziach od razu, a nie po restarcie

// todo variable hints i type hints do jednego, potem dodać methodHints

// todo wycieki pamięci?
