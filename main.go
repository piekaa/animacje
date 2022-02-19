package main

import (
	"encoding/json"
	"fmt"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"io"
	"net/http"
	"os"
	"time"
)

func main() {
	e := echo.New()
	e.Use(middleware.Recover())

	e.Static("/", "static")

	e.File(":any", "static/index.html")

	e.POST("api/backup/:name", Backup)

	e.POST("api/image/:project/:imageName", PostUpload)

	e.Logger.Fatal(e.Start(":6813"))
}

type codeFile struct {
	Name    string `json:"name"`
	Content string `json:"content"`
	Init    bool   `json:"init"`
}

func Backup(c echo.Context) error {
	name := c.Param("name")

	var files []codeFile

	err := c.Bind(&files)

	if err != nil {
		fmt.Println(err)
		return err
	}

	t := time.Now().Unix() / 60

	fileBytes, err := os.ReadFile(fmt.Sprintf("backup/%s.json", name))

	var m map[int64][]codeFile

	if err != nil {
		m = make(map[int64][]codeFile)
	} else {
		err = json.Unmarshal(fileBytes, &m)
		if err != nil {
			fmt.Println(err)
			return err
		}
	}

	m[t] = files

	fileJson, err := json.Marshal(m)

	if err != nil {
		fmt.Println(err)
		return err
	}

	err = os.WriteFile(fmt.Sprintf("backup/%s.json", name), fileJson, 0777)

	if err != nil {
		fmt.Println(err)
		return err
	}

	return c.String(200, "")
}

func PostUpload(c echo.Context) error {

	project := c.Param("project")
	fileName := c.Param("imageName")

	file, err := c.FormFile("file")
	if err != nil {
		return err
	}
	from, err := file.Open()
	if err != nil {
		return err
	}
	defer from.Close()

	// Destination
	to, err := os.Create("static/img/" + project + "_" + fileName)
	if err != nil {
		return err
	}
	defer to.Close()

	// Copy
	if _, err = io.Copy(to, from); err != nil {
		return err
	}

	return c.String(http.StatusOK, fileName)
}

// todo variable hints i type hints do jednego, potem dodać methodHints

// todo line move czy set position źle działa
