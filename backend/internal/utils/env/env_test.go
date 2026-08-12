package env

import (
	"os"
	"testing"
)

func TestEnv(t *testing.T) {
	const MY_TEMP_VAR_KEY = "tempEnvVarKey"
	const tempValue = "myTempValue"

	if err := os.Setenv(MY_TEMP_VAR_KEY, tempValue); err != nil {
		t.Error(err)
	}

	cases := []struct {
		name     string
		expected string
		result   string
	}{
		{
			name:     "should return fallback value",
			expected: "fallbackValue",
			result:   GetStr("NONEXISTENT_ENV_VAR", "fallbackValue"),
		},
		{
			name:     "should return env value",
			expected: tempValue,
			result:   GetStr(MY_TEMP_VAR_KEY, "fallbackValue"),
		},
	}

	for _, item := range cases {

		if item.result != item.expected {
			t.Errorf("expected %s, but got %s", item.expected, item.result)
		}
	}

	if err := os.Unsetenv(MY_TEMP_VAR_KEY); err != nil {
		t.Error(err)
	}
}
