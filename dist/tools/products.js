"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProductTools = registerProductTools;
const zod_1 = require("zod");
const woocommerce_1 = require("../woocommerce");
function registerProductTools(server) {
    // List Products
    server.tool("list_products", {
        search: zod_1.z.string().optional().describe("Search query for products"),
        page: zod_1.z.number().optional().default(1).describe("Page number"),
        per_page: zod_1.z.number().optional().default(10).describe("Number of products per page"),
    }, async ({ search, page, per_page }) => {
        try {
            const params = { page, per_page };
            if (search)
                params.search = search;
            const response = await woocommerce_1.wc.get("products", params);
            const products = response.data.map((p) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                price: p.price,
                stock_status: p.stock_status,
            }));
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(products, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: (0, woocommerce_1.handleWcError)(error),
                    },
                ],
                isError: true,
            };
        }
    });
    // Get Product
    server.tool("get_product", {
        id: zod_1.z.number().describe("Product ID"),
    }, async ({ id }) => {
        try {
            const response = await woocommerce_1.wc.get(`products/${id}`);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(response.data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: (0, woocommerce_1.handleWcError)(error),
                    },
                ],
                isError: true,
            };
        }
    });
    // Create Product
    server.tool("create_product", {
        name: zod_1.z.string().describe("Product name"),
        type: zod_1.z.enum(["simple", "variable", "grouped", "external"]).default("simple"),
        regular_price: zod_1.z.string().optional().describe("Regular price"),
        description: zod_1.z.string().optional().describe("Product description"),
        short_description: zod_1.z.string().optional().describe("Product short description"),
    }, async (args) => {
        try {
            const response = await woocommerce_1.wc.post("products", args);
            return {
                content: [
                    {
                        type: "text",
                        text: `Product created successfully: ${JSON.stringify(response.data, null, 2)}`,
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: (0, woocommerce_1.handleWcError)(error),
                    },
                ],
                isError: true,
            };
        }
    });
    // Update Product
    server.tool("update_product", {
        id: zod_1.z.number().describe("Product ID"),
        name: zod_1.z.string().optional(),
        regular_price: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
    }, async ({ id, ...data }) => {
        try {
            const response = await woocommerce_1.wc.put(`products/${id}`, data);
            return {
                content: [
                    {
                        type: "text",
                        text: `Product updated successfully: ${JSON.stringify(response.data, null, 2)}`,
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: (0, woocommerce_1.handleWcError)(error),
                    },
                ],
                isError: true,
            };
        }
    });
    // Delete Product
    server.tool("delete_product", {
        id: zod_1.z.number().describe("Product ID"),
        force: zod_1.z.boolean().optional().default(false).describe("Permanently delete"),
    }, async ({ id, force }) => {
        try {
            const response = await woocommerce_1.wc.delete(`products/${id}`, { force });
            return {
                content: [
                    {
                        type: "text",
                        text: `Product deleted successfully: ${JSON.stringify(response.data, null, 2)}`,
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: (0, woocommerce_1.handleWcError)(error),
                    },
                ],
                isError: true,
            };
        }
    });
}
