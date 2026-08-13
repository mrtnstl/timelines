package crypto

import (
	"crypto/rand"
	"errors"
	"fmt"
)

func GenRandomBytesHex(size int) (string, error) {
	if size < 1 || size > 1024 {
		return "", errors.New("'size' must be between 1 and 1024")
	}
	buf := make([]byte, size)
	_, err := rand.Read(buf)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%x", buf), nil
}

func GenTimelinePublicID() (string, error) {
	randomHexSeq, err := GenRandomBytesHex(64)
	if err != nil {
		return "", err
	}
	return randomHexSeq, nil
}
