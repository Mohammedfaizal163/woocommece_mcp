"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOrderTools = registerOrderTools;
const zod_1 = require("zod");
const woocommerce_1 = require("../woocommerce");
function registerOrderTools(server) {
    // List Orders
    server.tool("list_orders", {
        page: zod_1.z.number().optional().default(1).describe("Page number"),
        per_page: zod_1.z.number().optional().default(10).describe("Number of orders per page"),
        status: zod_1.z.string().optional().describe("Order status (any, pending, processing, on-hold, completed, cancelled, refunded, failed, trash)"),
    }, async ({ page, per_page, status }) => {
        try {
            const params = { page, per_page };
            if (status)
                params.status = status;
            const response = await woocommerce_1.wc.get("orders", params);
            const orders = response.data.map((o) => ({
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
    // Get Order
    server.tool("get_order", {
        id: zod_1.z.number().describe("Order ID"),
    }, async ({ id }) => {
        try {
            const response = await woocommerce_1.wc.get(`orders/${id}`);
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
    // Update Order
    server.tool("update_order", {
        id: zod_1.z.number().describe("Order ID"),
        status: zod_1.z.enum(["pending", "processing", "on-hold", "completed", "cancelled", "refunded", "failed"]).describe("New status"),
    }, async ({ id, status }) => {
        try {
            const response = await woocommerce_1.wc.put(`orders/${id}`, { status });
            return {
                content: [
                    {
                        type: "text",
                        text: `Order updated successfully: ${JSON.stringify(response.data, null, 2)}`,
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
