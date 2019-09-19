package main

import (
	"filebrowse/handle"
	"log"
	"net/http"
)

func main() {
	resourcePath := handle.ResourceRoot()
	http.Handle("/resources/", http.StripPrefix("/resources/", http.FileServer(http.Dir(resourcePath))))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/resources", http.StatusFound)
	})
	http.HandleFunc("/info", handle.Info)
	err := http.ListenAndServe(":8086", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
