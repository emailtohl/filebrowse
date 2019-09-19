package handle

import (
	"encoding/json"
	"errors"
	"filebrowse/model"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func Info(w http.ResponseWriter, r *http.Request) {
	resourcePath := ResourceRoot()
	nodes, err := getAllFiles(resourcePath)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	httppath(nodes)
	b, err := json.Marshal(nodes)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Write(b)
}

func ResourceRoot() string {
	if len(os.Args) == 2 {
		return os.Args[1]
	}
	execpath, err := GetCurrentPath()
	if err != nil {
		panic(err)
	}
	return execpath
}

func getAllFiles(pathname string) ([]*model.Node, error) {
	var nodes []*model.Node
	rd, err := ioutil.ReadDir(pathname)
	if err != nil {
		return nodes, err
	}
	for _, fi := range rd {
		n := model.Node{
			Name: fi.Name(),
		}
		n.Path = filepath.Join(pathname, n.Name)
		if fi.IsDir() {
			n.IsParent = true
			n.Children, err = getAllFiles(filepath.Join(pathname, fi.Name()))
			if err != nil {
				return nodes, err
			}
		} else {
			n.IsParent = false
		}
		nodes = append(nodes, &n)
	}
	return nodes, nil
}

func httppath(nodes []*model.Node) {
	resourceRoot := ResourceRoot()
	for _, n := range nodes {
		n.Path = n.Path[len(resourceRoot)+1:]
		n.Path = strings.ReplaceAll(n.Path, "\\", "/")
		if len(n.Children) > 0 {
			httppath(n.Children)
		}
	}
}

func GetCurrentPath() (string, error) {
	file, err := exec.LookPath(os.Args[0])
	if err != nil {
		return "", err
	}
	path, err := filepath.Abs(file)
	if err != nil {
		return "", err
	}
	i := strings.LastIndex(path, "/")
	if i < 0 {
		i = strings.LastIndex(path, "\\")
	}
	if i < 0 {
		return "", errors.New(`error: Can't find "/" or "\".`)
	}
	return string(path[0 : i+1]), nil
}
