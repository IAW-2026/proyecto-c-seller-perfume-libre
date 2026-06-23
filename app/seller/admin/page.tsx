import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PanelAdmin from './panel-admin'
import { Vendedor, Producto, AdminProductosPorVendedor, ActionResponse } from '@/lib/db/db'
import { EsAdmin } from '@/lib/es-admin';


export default async function Page() {

    const admin = await EsAdmin();

    if (!admin)
        redirect("/");

    const productosPorVendedorResult = await AdminProductosPorVendedor();

    if (!productosPorVendedorResult.success) {
        return (
            <div className="errorDivFondo">

                <div className="errorDivPrincipal">

                    <p>Ocurrió el siguiente error</p>
                    <b>{productosPorVendedorResult.error!.description}</b>

                </div>

            </div>
        );
    }

    return (
        <PanelAdmin productosPorVendedor={productosPorVendedorResult.data!} />
    );
}