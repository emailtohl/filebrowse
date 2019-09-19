package handle

import (
	"encoding/json"
	"fmt"
	"testing"
)

func TestGetAllFile(t *testing.T) {
	pathname, err := GetCurrentPath()
	if err != nil {
		t.Error(err.Error())
	}
	nodes, err := getAllFiles(pathname)
	if err != nil {
		t.Error(err.Error())
	}
	b, err := json.Marshal(nodes)
	if err != nil {
		t.Error(err.Error())
	}
	fmt.Println(string(b))
}
