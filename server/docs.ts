import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";

const docs = new Hono();

// Configure OpenAPI spec manually
const openAPISpec = {
  openapi: "3.0.0",
  info: {
    title: "Replas API",
    version: "1.0.0",
    description: "API documentation for Replas - Recycle to E-Money platform"
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server"
    }
  ],
  security: [
    {
      bearerAuth: []
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  paths: {
    "/api/auth/login": {
      post: {
        summary: "User login",
        description: "Authenticate user and return JWT token",
        tags: ["Authentication"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    description: "User email address",
                    example: "user@example.com"
                  },
                  password: {
                    type: "string",
                    format: "password",
                    description: "User password",
                    example: "password123"
                  }
                },
                required: ["email", "password"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        role: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/auth/register": {
      post: {
        summary: "User registration",
        description: "Register a new user account",
        tags: ["Authentication"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Full name",
                    example: "John Doe"
                  },
                  email: {
                    type: "string",
                    format: "email",
                    description: "Email address",
                    example: "john@example.com"
                  },
                  password: {
                    type: "string",
                    format: "password",
                    description: "Password (min 6 characters)",
                    example: "password123"
                  },
                  role: {
                    type: "string",
                    enum: ["user", "admin"],
                    description: "User role",
                    example: "user"
                  }
                },
                required: ["name", "email", "password"]
              }
            }
          }
        },
        responses: {
          201: {
            description: "Registration successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        role: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/iot/activate": {
      post: {
        summary: "Activate IoT machine session",
        description: "Activate a machine for bottle collection session. Requires authentication.",
        tags: ["IoT"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  machineId: {
                    type: "string",
                    description: "Machine code (e.g., 'banksampah01')",
                    example: "banksampah01"
                  }
                },
                required: ["machineId"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Session activated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    machine: { type: "object" },
                    sessionId: { type: "string" },
                    activatedAt: { type: "string" },
                    mqttConnected: { type: "boolean" }
                  }
                }
              }
            }
          },
          400: {
            description: "Bad request - machine in use or invalid",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" }
                  }
                }
              }
            }
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" }
                  }
                }
              }
            }
          },
          404: {
            description: "User or machine not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" }
                  }
                }
              }
            }
          },
          503: {
            description: "IoT service unavailable",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                    details: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/iot/session-end": {
      post: {
        summary: "End IoT machine session",
        description: "Manually end a bottle collection session and calculate points",
        tags: ["IoT"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  machineId: {
                    type: "string",
                    description: "Machine code",
                    example: "banksampah01"
                  },
                  totalBottles: {
                    type: "number",
                    description: "Total bottles collected",
                    example: 5
                  }
                },
                required: ["machineId", "totalBottles"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Session ended successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    points: { type: "number" },
                    newBalance: { type: "number" },
                    machine: { type: "object" },
                    endedAt: { type: "string" }
                  }
                }
              }
            }
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" }
                  }
                }
              }
            }
          },
          404: {
            description: "Machine not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/iot/status": {
      get: {
        summary: "Get IoT service status",
        description: "Check MQTT connection status",
        tags: ["IoT"],
        responses: {
          200: {
            description: "Status retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    mqttConnected: { type: "boolean" },
                    timestamp: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/web/profile": {
      get: {
        summary: "Get user profile",
        description: "Get current user profile information",
        tags: ["User"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Profile retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { type: "object" },
                    wallet: { type: "object" }
                  }
                }
              }
            }
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        summary: "Update user profile",
        description: "Update current user profile information",
        tags: ["User"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Profile updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    user: { type: "object" }
                  }
                }
              }
            }
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

// Routes for API documentation
docs.get("/openapi.json", (c) => {
  return c.json(openAPISpec);
});

// Swagger UI
docs.get("/docs", swaggerUI({
  url: "/docs/openapi.json",
  title: "Replas API Documentation"
}));

// Scalar API Reference (alternative modern UI)
docs.get("/scalar", (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Replas API Reference</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <script
          id="api-reference"
          data-url="/docs/openapi.json"
        ></script>
        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      </body>
    </html>
  `);
});

export { docs };
