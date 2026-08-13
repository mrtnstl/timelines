package main

type CreateTimelineRequest struct {
	Title string `json:"title" binding:"required"`
}

type UpdateTimelineRequest struct {
	Title       string `json:"title" binding:"max=80"`
	IsPublished *bool  `json:"is_published"`
	Version     int64  `json:"version" binding:"required"`
}
