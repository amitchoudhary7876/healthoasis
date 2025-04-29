
import React, { useState, useMemo } from "react";
import { Transaction } from "@/pages/WalletPage";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
}

const PAGE_SIZE = 5;

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "credit" | "debit">("all");
  const [page, setPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filtered and sorted data
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (searchTerm.trim()) {
      filtered = filtered.filter((t) =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (typeFilter !== "all") {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });
    return filtered;
  }, [transactions, searchTerm, typeFilter, sortDirection]);

  const pageCount = Math.ceil(filteredTransactions.length / PAGE_SIZE);

  const currentPageData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredTransactions.slice(start, start + PAGE_SIZE);
  }, [filteredTransactions, page]);

  const toggleSortDirection = () => {
    setSortDirection((dir) => (dir === "asc" ? "desc" : "asc"));
  };

  function exportCSV() {
    const header = ["Type", "Amount", "Date", "Description"];
    const rows = filteredTransactions.map((t) => [
      t.type,
      t.amount.toFixed(2),
      new Date(t.timestamp).toLocaleString(),
      t.description,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows]
        .map((e) => e.map((v) => `"${v.replace(/"/g, '""')}"`).join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-md shadow p-6">
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Input
          placeholder="Search description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="rounded border border-input bg-background px-3 py-2 text-sm"
          aria-label="Filter transaction type"
        >
          <option value="all">All types</option>
          <option value="credit">Credits</option>
          <option value="debit">Debits</option>
        </select>
        <Button variant="outline" size="sm" onClick={exportCSV} className="flex items-center gap-2">
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead className="cursor-pointer" onClick={toggleSortDirection}>
              Amount {sortDirection === "asc" ? "▲" : "▼"}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={toggleSortDirection}>
              Date & Time {sortDirection === "asc" ? "▲" : "▼"}
            </TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-10">
                Loading...
              </TableCell>
            </TableRow>
          ) : currentPageData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-10">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            currentPageData.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <span
                    className={cn(
                      "capitalize font-semibold",
                      transaction.type === "credit"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {transaction.type}
                  </span>
                </TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
                <TableCell>{transaction.description}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-3">
        <Button
          size="sm"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2 text-sm font-medium">
          Page {page} of {pageCount}
        </div>
        <Button
          size="sm"
          disabled={page >= pageCount}
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TransactionTable;