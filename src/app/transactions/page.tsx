import { Button } from "@/_components/ui/button";
import { DataTable } from "@/_components/ui/data-table";
import { db } from "@/_lib/prisma";
import { ArrowDownUpIcon } from "lucide-react";
import { transactionColumns } from "./_columns";

export default async function TransactionsPage() {
  const transactions = await db.transaction.findMany({});
  return (
    <div className="space-y-6 p-6">
      {/* TÍTULO E BOTÃO */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Transações</h1>
        <Button className="rounded-full">
          Adicionar transação
          <ArrowDownUpIcon />
        </Button>
      </div>
      <DataTable columns={transactionColumns} data={transactions} />
    </div>
  );
}
