import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PanelAdmin from './panel-admin'
import { Vendedor, Producto, AdminProductosPorVendedor } from '@/lib/db/db'
import { EsAdmin } from '@/lib/es-admin';


export default async function Page() {

    const admin = await EsAdmin();

    if (!admin)
        redirect("/");

    const productosPorVendedor = await AdminProductosPorVendedor();

    return (
        <PanelAdmin productosPorVendedor={productosPorVendedor} />
    );
}