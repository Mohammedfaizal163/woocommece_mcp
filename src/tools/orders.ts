import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { wc, handleWcError } from "../woocommerce";

export function registerOrderTools(server: McpServer) {
    // List Orders
    server.tool(
        "list_orders",
        {
            page: z.number().optional().default(1).describe("Page number"),
            per_page: z.number().optional().default(10).describe("Number of orders per page"),
            status: z.string().optional().describe("Order status (any, pending, processing, on-hold, completed, cancelled, refunded, failed, trash)"),
        },
        async ({ page, per_page, status }) => {
            try {
                const params: any = { page, per_page };
                if (status) params.status = status;

                const response = await wc.get("orders", params);
                const orders = response.data.map((o: any) => ({
                    id: o.id,
                    status: o.status,
                    total: o.total,
                    currency: o.currency,
                    date_created: o.date_created,
                    customer_id: o.customer_id,
                    billing: o.billing,
                }));

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(orders, null, 2),
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

    // Get Order
    server.tool(
        "get_order",
        {
            id: z.number().describe("Order ID"),
        },
        async ({ id }) => {
            try {
                const response = await wc.get(`orders/${id}`);
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

    // Update Order
    server.tool(
        "update_order",
        {
            id: z.number().describe("Order ID"),
            status: z.enum(["pending", "processing", "on-hold", "completed", "cancelled", "refunded", "failed"]).describe("New status"),
        },
        async ({ id, status }) => {
            try {
                const response = await wc.put(`orders/${id}`, { status });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Order updated successfully: ${JSON.stringify(response.data, null, 2)}`,
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
