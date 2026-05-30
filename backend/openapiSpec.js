export const openapiSpec = {
	openapi: "3.0.3",
	info: {
		title: "Car Shop API",
		version: "1.0.0",
		description:
			"Interactive API documentation for the Car Shop demo backend.",
	},
	servers: [
		{
			url: "/",
			description: "Current backend server",
		},
	],
	tags: [
		{ name: "Health" },
		{ name: "Auth" },
		{ name: "Account" },
		{ name: "Cars" },
		{ name: "Cart" },
		{ name: "Orders" },
		{ name: "Admin" },
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
		},
		schemas: {
			Error: {
				type: "object",
				properties: {
					error: { type: "string", example: "Invalid token" },
				},
				required: ["error"],
			},
			TokenResponse: {
				type: "object",
				properties: {
					token: {
						type: "string",
						description: "JWT bearer token for authenticated endpoints.",
					},
				},
				required: ["token"],
			},
			Credentials: {
				type: "object",
				properties: {
					username: { type: "string", example: "demo" },
					password: { type: "string", example: "password123" },
				},
				required: ["username", "password"],
			},
			User: {
				type: "object",
				properties: {
					id: { type: "integer", example: 1 },
					username: { type: "string", example: "demo" },
				},
				required: ["id", "username"],
			},
			Car: {
				type: "object",
				properties: {
					id: { type: "integer", example: 1 },
					model: { type: "string", example: "Model Y" },
					make: { type: "string", example: "Tesla" },
					year: { type: "integer", example: 2025 },
					rangeMiles: { type: "integer", example: 330 },
					price: { type: "integer", example: 44990 },
					imageUrl: {
						type: "string",
						example: "/cars/photos/2025-tesla-model-y.jpg",
					},
					available: { type: "integer", enum: [0, 1], example: 1 },
				},
				required: [
					"id",
					"model",
					"make",
					"year",
					"rangeMiles",
					"price",
					"imageUrl",
					"available",
				],
			},
			CartCount: {
				type: "object",
				properties: {
					count: { type: "integer", example: 2 },
				},
				required: ["count"],
			},
			CartAddResponse: {
				type: "object",
				properties: {
					ok: { type: "boolean", example: true },
					count: { type: "integer", example: 1 },
				},
				required: ["ok", "count"],
			},
			OrderResponse: {
				type: "object",
				properties: {
					orderId: { type: "integer", example: 1 },
					total: { type: "integer", example: 89980 },
					itemCount: { type: "integer", example: 2 },
				},
				required: ["orderId", "total", "itemCount"],
			},
			AdminResetResponse: {
				type: "object",
				properties: {
					ok: { type: "boolean", example: true },
					usersDeleted: { type: "boolean", example: true },
					tokensInvalidated: { type: "boolean", example: true },
					carsRestored: { type: "integer", example: 26 },
				},
				required: ["ok", "usersDeleted", "tokensInvalidated", "carsRestored"],
			},
		},
		responses: {
			Unauthorized: {
				description: "Missing, expired, or invalid bearer token.",
				content: {
					"application/json": {
						schema: { $ref: "#/components/schemas/Error" },
					},
				},
			},
			NotFound: {
				description: "Requested resource was not found.",
				content: {
					"application/json": {
						schema: { $ref: "#/components/schemas/Error" },
					},
				},
			},
		},
	},
	paths: {
		"/ping": {
			get: {
				tags: ["Health"],
				summary: "Check backend health",
				responses: {
					200: {
						description: "Backend is reachable.",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										message: { type: "string", example: "pong" },
									},
									required: ["message"],
								},
							},
						},
					},
				},
			},
		},
		"/auth/register": {
			post: {
				tags: ["Auth"],
				summary: "Register a new user",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/Credentials" },
						},
					},
				},
				responses: {
					200: {
						description: "User registered and token issued.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/TokenResponse" },
							},
						},
					},
					400: {
						description: "Missing fields or username already exists.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
				},
			},
		},
		"/auth/login": {
			post: {
				tags: ["Auth"],
				summary: "Log in with username and password",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/Credentials" },
						},
					},
				},
				responses: {
					200: {
						description: "Token issued.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/TokenResponse" },
							},
						},
					},
					400: {
						description: "Invalid credentials.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
				},
			},
		},
		"/me": {
			get: {
				tags: ["Account"],
				summary: "Get the current user",
				security: [{ bearerAuth: [] }],
				responses: {
					200: {
						description: "Current user profile.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/User" },
							},
						},
					},
					401: { $ref: "#/components/responses/Unauthorized" },
				},
			},
		},
		"/cars": {
			get: {
				tags: ["Cars"],
				summary: "List available cars",
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						name: "model",
						in: "query",
						schema: { type: "string" },
						description: "Case-insensitive model search.",
					},
					{ name: "minRange", in: "query", schema: { type: "integer" } },
					{ name: "maxRange", in: "query", schema: { type: "integer" } },
					{
						name: "range",
						in: "query",
						schema: { type: "integer" },
						description: "Legacy alias for maxRange.",
					},
					{ name: "minPrice", in: "query", schema: { type: "integer" } },
					{ name: "maxPrice", in: "query", schema: { type: "integer" } },
					{
						name: "price",
						in: "query",
						schema: { type: "integer" },
						description: "Legacy alias for maxPrice.",
					},
					{
						name: "sortBy",
						in: "query",
						schema: { type: "string", enum: ["year", "price", "range"] },
					},
					{
						name: "sortDirection",
						in: "query",
						schema: { type: "string", enum: ["asc", "desc"] },
					},
				],
				responses: {
					200: {
						description: "Available cars.",
						content: {
							"application/json": {
								schema: {
									type: "array",
									items: { $ref: "#/components/schemas/Car" },
								},
							},
						},
					},
					401: { $ref: "#/components/responses/Unauthorized" },
				},
			},
		},
		"/cars/{id}": {
			get: {
				tags: ["Cars"],
				summary: "Get one car",
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "integer", minimum: 1 },
					},
				],
				responses: {
					200: {
						description: "Car details.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Car" },
							},
						},
					},
					400: {
						description: "Invalid car id.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
					401: { $ref: "#/components/responses/Unauthorized" },
					404: { $ref: "#/components/responses/NotFound" },
				},
			},
		},
		"/cart": {
			get: {
				tags: ["Cart"],
				summary: "List cars in the current user's cart",
				security: [{ bearerAuth: [] }],
				responses: {
					200: {
						description: "Cart cars.",
						content: {
							"application/json": {
								schema: {
									type: "array",
									items: { $ref: "#/components/schemas/Car" },
								},
							},
						},
					},
					401: { $ref: "#/components/responses/Unauthorized" },
				},
			},
		},
		"/cart/count": {
			get: {
				tags: ["Cart"],
				summary: "Get cart count",
				security: [{ bearerAuth: [] }],
				responses: {
					200: {
						description: "Cart count.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/CartCount" },
							},
						},
					},
					401: { $ref: "#/components/responses/Unauthorized" },
				},
			},
		},
		"/cart/add/{id}": {
			post: {
				tags: ["Cart"],
				summary: "Add a car to the cart",
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "integer", minimum: 1 },
					},
				],
				responses: {
					200: {
						description: "Car added or already present in cart.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/CartAddResponse" },
							},
						},
					},
					400: {
						description: "Invalid car id.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
					401: { $ref: "#/components/responses/Unauthorized" },
					404: { $ref: "#/components/responses/NotFound" },
					409: {
						description: "Car is no longer available.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
				},
			},
		},
		"/order": {
			post: {
				tags: ["Orders"],
				summary: "Create an order from the current cart",
				security: [{ bearerAuth: [] }],
				responses: {
					200: {
						description: "Order created.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/OrderResponse" },
							},
						},
					},
					400: {
						description: "Cart is empty.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
					401: { $ref: "#/components/responses/Unauthorized" },
					409: {
						description: "A selected car became unavailable.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
				},
			},
		},
		"/admin/reset": {
			post: {
				tags: ["Admin"],
				summary: "Reset demo data",
				description:
					"Deletes users, carts, and orders, restores cars, and invalidates existing tokens.",
				responses: {
					200: {
						description: "Demo data reset.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/AdminResetResponse" },
							},
						},
					},
					500: {
						description: "Reset failed.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
				},
			},
		},
	},
};
