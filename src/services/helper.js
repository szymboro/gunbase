export function isLogging() {
  let logging = localStorage.getItem("LOGGING");
  if (logging == null) {
    localStorage.setItem("LOGGING", false);
  }
}

export function processData(option, key, value = null) {
  try {
    if (option === "get") {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }

    if (option === "set" && value !== null) {
      localStorage.setItem(key, JSON.stringify(value));
    }

    if (option === "del") {
      localStorage.removeItem(key);
    }

    if (option === "update" && value !== null && typeof value === "object") {
      const existingData = localStorage.getItem(key);
      if (existingData) {
        const parsedData = JSON.parse(existingData);
        const updatedData = { ...parsedData, ...value };
        localStorage.setItem(key, JSON.stringify(updatedData));
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }

    if (option === "append" && value !== null && typeof value === "object") {
      const existingData = localStorage.getItem(key);

      if (existingData) {
        const parsedData = JSON.parse(existingData);

        if (Array.isArray(parsedData)) {
          parsedData.push(value);
          localStorage.setItem(key, JSON.stringify(parsedData));
        } else {
          localStorage.setItem(key, JSON.stringify([parsedData, value]));
        }
      } else {
        localStorage.setItem(key, JSON.stringify([value]));
      }
    }
  } catch (error) {
    console.error("Error accessing localStorage:", error);
  }
}
