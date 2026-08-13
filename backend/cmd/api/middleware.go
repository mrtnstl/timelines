package main

import (
	"reflect"

	"github.com/gin-gonic/gin"
)

func (a *application) validateRequest(requestStruct any) gin.HandlerFunc {
	reqType := reflect.TypeOf(requestStruct)
	if reqType == nil {
		panic("requestStruct must be non-nil")
	}
	return func(c *gin.Context) {
		req := reflect.New(reqType).Interface()
		if err := c.ShouldBindJSON(req); err != nil {
			a.badRequestResponse(c, err)
			return
		}

		c.Set(CtxKeyValidatedRequest, req)
		c.Next()
	}
}
