"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const products_1 = require("./tools/products");
const orders_1 = require("./tools/orders");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = new mcp_js_1.McpServer({
    name: "woocommerce-mcp-server",
    version: "1.0.0",
});
// Register tools
(0, products_1.registerProductTools)(server);
(0, orders_1.registerOrderTools)(server);
// Initialize Streamable Transport
// We can use a single transport instance for the server
let transport;
// Initialize the transport immediately
transport = new streamableHttp_js_1.StreamableHTTPServerTransport();
server.connect(transport);
const PORT = process.env.PORT || 3000;
app.post("/message", async (req, res) => {
    await transport.handleRequest(req, res);
});
app.get("/sse", async (req, res) => {
    await transport.handleRequest(req, res);
});
app.listen(PORT, () => {
    console.log(`WooCommerce MCP Server running on port ${PORT}`);
    console.log(`SSE Endpoint: http://localhost:${PORT}/sse`);
    console.log(`Message Endpoint: http://localhost:${PORT}/message`);
});
