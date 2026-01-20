"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWcError = exports.wc = void 0;
const woocommerce_rest_api_1 = __importDefault(require("@woocommerce/woocommerce-rest-api"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.WC_URL || !process.env.WC_CONSUMER_KEY || !process.env.WC_CONSUMER_SECRET) {
    throw new Error("Missing WooCommerce credentials in .env file");
}
exports.wc = new woocommerce_rest_api_1.default({
    url: process.env.WC_URL,
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET,
    version: "wc/v3",
});
// Helper to handle errors
const handleWcError = (error) => {
    if (error.response && error.response.data) {
        return `WooCommerce Error: ${JSON.stringify(error.response.data)}`;
    }
    return `Error: ${error.message}`;
};
exports.handleWcError = handleWcError;
