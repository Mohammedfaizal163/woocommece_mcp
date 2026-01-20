import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { wc, handleWcError } from "../woocommerce";

export function registerProductTools(server: McpServer) {
    // List Products
    server.tool(
        "list_products",
        {
            search: z.string().optional().describe("Search query for products"),
            page: z.number().optional().default(1).describe("Page number"),
            per_page: z.number().optional().default(10).describe("Number of products per page"),
        },
        async ({ search, page, per_page }) => {
            try {
                const params: any = { page, per_page };
                if (search) params.search = search;

                const response = await wc.get("products", params);
                const products = response.data.map((p: any) => ({
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
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: handleWcError(error),
                        },
                    ],
                    isError: true,
                };
            }
        }
    );

    // Get Product
    server.tool(
        "get_product",
        {
            id: z.number().describe("Product ID"),
        },
        async ({ id }) => {
            try {
                const response = await wc.get(`products/${id}`);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(response.data, null, 2),
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: handleWcError(error),
                        },
                    ],
                    isError: true,
                };
            }
        }
    );

    // Create Product
    server.tool(
        "create_product",
        {
            name: z.string().describe("Product name"),
            type: z.enum(["simple", "variable", "grouped", "external"]).default("simple"),
            regular_price: z.string().optional().describe("Regular price"),
            description: z.string().optional().describe("Product description"),
            short_description: z.string().optional().describe("Product short description"),
        },
        async (args) => {
            try {
                const response = await wc.post("products", args);
                return {
                    content: [
                        {
                            type: "text",
                            text: `Product created successfully: ${JSON.stringify(response.data, null, 2)}`,
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: handleWcError(error),
                        },
                    ],
                    isError: true,
                };
            }
        }
    );

    // Update Product
    server.tool(
        "update_product",
        {
            id: z.number().describe("Product ID"),
            name: z.string().optional(),
            regular_price: z.string().optional(),
            description: z.string().optional(),
        },
        async ({ id, ...data }) => {
            try {
                const response = await wc.put(`products/${id}`, data);
                return {
                    content: [
                        {
                            type: "text",
                            text: `Product updated successfully: ${JSON.stringify(response.data, null, 2)}`,
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: handleWcError(error),
                        },
                    ],
                    isError: true,
                };
            }
        }
    );

    // Delete Product
    server.tool(
        "delete_product",
        {
            id: z.number().describe("Product ID"),
            force: z.boolean().optional().default(false).describe("Permanently delete"),
        },
        async ({ id, force }) => {
            try {
                const response = await wc.delete(`products/${id}`, { force });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Product deleted successfully: ${JSON.stringify(response.data, null, 2)}`,
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: handleWcError(error),
                        },
                    ],
                    isError: true,
                };
            }
        }
    );
}
