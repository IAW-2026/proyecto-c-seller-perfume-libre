import { EsAdmin } from "@/lib/es-admin";
import TopBar from "./top-bar";

export default async function TopBarServer() {
    const admin = await EsAdmin();

    return <TopBar admin={admin} />;
}