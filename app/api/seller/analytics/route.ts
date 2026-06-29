import { NextResponse } from "next/server";
import { pool } from '@/lib/db/queries/connect';
import { AnalyticsCategoriasTop, AnalyticsStatsDeProductos } from "../../queries";

export async function GET(request: Request) {

    const apiKey = request.headers.get("api_key");

    if (apiKey !== process.env.SELLER_API_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const sellersResult = await pool.query(`SELECT COUNT(*) as count FROM vendedor`);
        const totalSellers = parseInt(sellersResult.rows[0].count, 10);

        const stats = await AnalyticsStatsDeProductos();
        const categoriasTop = await AnalyticsCategoriasTop();

        return NextResponse.json({
            totalSellers,
            totalProducts: parseInt(stats.total_products || 0, 10),
            activeProducts: parseInt(stats.active_products || 0, 10),
            totalStock: parseInt(stats.total_stock || 0, 10),
            topCategories: categoriasTop
        });
    } catch (error) {
        console.error("Error en analytics API seller:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
