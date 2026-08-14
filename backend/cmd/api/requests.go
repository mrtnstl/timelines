package main

type CreateTimelineRequest struct {
	Title string `json:"title" binding:"required"`
}

type UpdateTimelineRequest struct {
	Title       *string `json:"title" binding:"max=80"`
	IsPublished *bool  `json:"is_published"`
	Version     int    `json:"version" binding:"required"`
}

type CreateEventRequest struct {
	Title       string   `json:"title" binding:"required"`
	Date        string   `json:"date" binding:"required"`
	Description *string  `json:"description"`
	Image       *string  `json:"image"`
	Serial      *float64 `json:"serial"`
}

type UpdateEventRequest struct {
	Title       *string  `json:"title"`
	Date        *string  `json:"date"`
	Description *string `json:"description"`
	Image       *string `json:"image"`
	Serial      *int     `json:"serial"`
	Version     int     `json:"version" binding:"required"`
}
