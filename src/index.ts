import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import dotenv from "dotenv";
import { registerProductTools } from "./tools/products";
import { registerOrderTools } from "./tools/orders";

dotenv.config();

const app = express();
app.use(cors());

const server = new McpServer({
    name: "woocommerce-mcp-server",
    version: "1.0.0",
});

// Register tools
registerProductTools(server);
registerOrderTools(server);

// Initialize Streamable Transport
// We can use a single transport instance for the server
let transport: StreamableHTTPServerTransport;

// Initialize the transport immediately
transport = new StreamableHTTPServerTransport();
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
