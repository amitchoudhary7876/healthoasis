import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Wallet } from "lucide-react";


interface WalletCardProps {
  balance: number;
  onAddMoney: () => void;
  onWithdrawMoney: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({
  balance,
  onAddMoney,
  onWithdrawMoney,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-6">
      <div className="flex items-center space-x-3">
        <Wallet className="h-10 w-10 text-primary" />
        <div>
          <div className="text-xs text-muted-foreground uppercase font-semibold">
            Current Balance
          </div>
          <div className="text-3xl font-bold">₹{Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </div>
      <div className="flex space-x-4">
        <Button variant="default" onClick={onAddMoney} size="default" className="flex items-center gap-2">
          <ArrowDown size={16} />
          Add Money
        </Button>
        <Button variant="secondary" onClick={onWithdrawMoney} size="default" className="flex items-center gap-2">
          <ArrowUp size={16} />
          Withdraw Money
        </Button>
      </div>
    </div>
  );
};

export default WalletCard;
