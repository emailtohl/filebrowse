package model

type Node struct {
	Name     string  `json:"name"`
	Path     string  `json:"path"`
	IsParent bool    `json:"isParent"`
	Children []*Node `json:"children"`
}
