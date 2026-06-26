import { NextResponse } from "next/server";
import { pool } from '@/lib/db/queries/connect';

export async function GET(request: Request) {
  const apiKey = request.headers.get("api_key");
  if (apiKey !== process.env.SELLER_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sellersResult = await pool.query(`SELECT COUNT(*) as count FROM vendedor`);
    const totalSellers = parseInt(sellersResult.rows[0].count, 10);

    const productsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) as active_products,
        SUM(stock) as total_stock
      FROM producto
      WHERE estado != 'borrado'
    `);
    
    const stats = productsResult.rows[0];

    // Top categories
    const catResult = await pool.query(`
      SELECT c.nombre, COUNT(*) as count 
      FROM categoria c
      JOIN producto p ON p.producto_id = c.producto_id
      WHERE p.estado = 'activo'
      GROUP BY c.nombre
      ORDER BY count DESC
      LIMIT 5
    `);

    return NextResponse.json({
      totalSellers,
      totalProducts: parseInt(stats.total_products || 0, 10),
      activeProducts: parseInt(stats.active_products || 0, 10),
      totalStock: parseInt(stats.total_stock || 0, 10),
      topCategories: catResult.rows
    });
  } catch (error) {
    console.error("Error en analytics API seller:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
