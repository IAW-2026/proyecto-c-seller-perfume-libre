declare namespace NodeJS {
    interface ProcessEnv {
        DATABASE_URL: string;
		SELLER_API_KEY: string;
		FEEDBACK_APP: string;
		SHIPPING_APP: string;
    }
}