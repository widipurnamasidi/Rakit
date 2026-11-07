const bearer = [{ bearerAuth: [] }];

// Helper op dengan fleksibilitas menerima tags & requestBody via extra
const op = (summary: string, tags: string[], extra: object = {}) => ({
  tags,
  summary,
  security: bearer,
  responses: {
    200: { description: "OK" },
    403: { description: "Token invalid/expired or role not allowed" },
  },
  ...extra,
});

export const swaggerDocument = {
  openapi: "3.0.0",
  info: { title: "API Inventori Peralatan Teknisi", version: "1.0.0" },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
  paths: {
    // === AUTH ===
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login (returns JWT in data)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "admin@gmail.com" },
                  password: { type: "string", example: "password123" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: { description: "OK" },
          400: { description: "Wrong email/password" },
          403: { description: "Inactive account" },
        },
      },
    },
    "/api/auth/me": { get: op("Current user", ["Auth"]) },

    // === USERS ===
    "/api/users": {
      get: op("List users (admin)", ["Users"]),
      post: op("Create user (admin)", ["Users"]),
    },
    "/api/users/{id}": { put: op("Update user (admin)", ["Users"]) },

    // === CATEGORIES ===
    "/api/categories": {
      get: op("List categories", ["Categories"]),
      post: op("Create category (admin)", ["Categories"]),
    },
    "/api/categories/{id}": {
      put: op("Update category (admin)", ["Categories"]),
      delete: op("Delete unused category (admin)", ["Categories"]),
    },

    // === EQUIPMENT ===
    "/api/equipment": {
      get: op("List equipment (filters: status, condition, category, search)", [
        "Equipment",
      ]),
      post: op("Create equipment (admin)", ["Equipment"]),
    },
    "/api/equipment/{id}": {
      get: op("Equipment detail", ["Equipment"]),
      put: op("Update equipment (admin)", ["Equipment"]),
    },

    // === LOANS ===
    "/api/loans": {
      get: op("List loans (technician: own only)", ["Loans"]),
      post: op("Lend a unit (admin); 409 if unavailable", ["Loans"]),
    },
    "/api/loans/mine": { get: op("My loans", ["Loans"]) },
    "/api/loans/{id}/return": {
      post: op(
        "Return a unit with returnCondition (admin); 409 if already returned",
        ["Loans"],
      ),
    },

    // === SCAN & QR CODE ===
    "/api/scan/category/{id}": {
      get: op(
        "Category QR: every unit in the category, its holder, and the action allowed for the caller (read-only)",
        ["Scan QR"],
      ),
    },
    "/api/scan/{serial}": {
      get: op(
        "Scan QR: equipment info and the action available to the caller (read-only)",
        ["Scan QR"],
      ),
    },
    "/api/scan/{serial}/borrow": {
      post: op(
        "Technician borrows the scanned equipment for themself; 409 if not available",
        ["Scan QR"],
      ),
    },
    "/api/scan/{serial}/return": {
      post: op(
        "Technician returns their own scanned loan with returnCondition",
        ["Scan QR"],
      ),
    },

    // === DASHBOARD ===
    "/api/dashboard": {
      get: op("Dashboard (admin: all; technician: own loans)", ["Dashboard"]),
    },
  },
};
