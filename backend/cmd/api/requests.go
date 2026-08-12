package main

type RequestStructs interface {
	CreateTimelineRequest
}

type CreateTimelineRequest struct {
	Title string `json:"title" binding:"required"`
	Date  string `json:"date" binding:"required,datetime=2006-01-02"`
}
