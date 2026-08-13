package crypto

import (
	"errors"
	"testing"
)

func TestGenRandomBytesHex(t *testing.T) {
	cases := []struct {
		name              string
		arg               int
		expectedStrLength int
		expectedErr       error
	}{
		{
			name:              "should return err when argument is lesser than 1",
			arg:               0,
			expectedStrLength: 0,
			expectedErr:       errors.New("'size' must be between 1 and 1024"),
		},
		{
			name:              "should return err when argument is greater than 1024",
			arg:               1025,
			expectedStrLength: 0,
			expectedErr:       errors.New("'size' must be between 1 and 1024"),
		},
		{
			name:              "should return a string in hexadecimal format",
			arg:               8,
			expectedStrLength: 16,
			expectedErr:       nil,
		},
	}

	for _, item := range cases {
		result, err := GenRandomBytesHex(item.arg)
		if err != nil {
			if item.expectedErr.Error() != err.Error() {
				t.Errorf("expected error to be %s, but got %s", item.expectedErr.Error(), err.Error())
			}
		}

		if len(result) != item.expectedStrLength {
			t.Errorf("expected results len to be %d, but got %d", item.expectedStrLength, len(result))
		}
	}
}

func TestGenTimelinePublicID(t *testing.T) {
	cases := []struct {
		name        string
		expectedLen int
	}{
		{
			name:        "should return a string with len = 128",
			expectedLen: 128,
		},
	}

	for _, item := range cases {
		result, err := GenTimelinePublicID()
		if err != nil {
			t.Error(err)
		}
		if len(result) != item.expectedLen {
			t.Errorf("expected results len to be %d, but got %d", item.expectedLen, len(result))
		}
	}
}
