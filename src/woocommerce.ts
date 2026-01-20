import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.WC_URL || !process.env.WC_CONSUMER_KEY || !process.env.WC_CONSUMER_SECRET) {
    throw new Error("Missing WooCommerce credentials in .env file");
}

export const wc = new WooCommerceRestApi({
    url: process.env.WC_URL,
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET,
    version: "wc/v3",
});

// Helper to handle errors
export const handleWcError = (error: any) => {
    if (error.response && error.response.data) {
        return `WooCommerce Error: ${JSON.stringify(error.response.data)}`;
    }
    return `Error: ${error.message}`;
};
