
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface WithdrawMoneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (amount: number, transaction: any) => void;
  currentBalance: number;
}

interface WithdrawFormData {
  amount: string;
  accountDetails: string;
}

const WithdrawMoneyModal: React.FC<WithdrawMoneyModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
  currentBalance,
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<WithdrawFormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: WithdrawFormData) => {
    const amountNum = parseFloat(data.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid amount greater than zero.", variant: "destructive" });
      return;
    }
    if (amountNum > currentBalance) {
      toast({ title: "Insufficient balance", description: "Withdrawal amount exceeds your current balance.", variant: "destructive" });
      return;
    }
    if (!data.accountDetails || data.accountDetails.trim().length < 5) {
      toast({ title: "Invalid account details", description: "Please provide valid withdrawal account information.", variant: "destructive" });
      return;
    }

    setLoading(true);

    // For demo: simulate withdrawal request accepted
    setTimeout(() => {
      const transaction = {
        id: crypto.randomUUID(),
        type: "debit" as const,
        amount: amountNum,
        date: new Date().toISOString(),
        description: `Withdrawal: ${data.accountDetails}`,
      };
      onSuccess(amountNum, transaction);
      toast({ title: "Withdrawal Success", description: "Your withdrawal request has been submitted.", variant: "default" });
      reset();
      setLoading(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Withdraw Money</DialogTitle>
            </DialogHeader>
            <div>
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 0.01, message: "Amount must be at least $0.01" },
                })}
              />
              {errors.amount && (
                <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="accountDetails">Withdrawal Account Details</Label>
              <Input
                id="accountDetails"
                {...register("accountDetails", {
                  required: "Account details are required",
                  minLength: { value: 5, message: "Enter valid account details" },
                })}
              />
              {errors.accountDetails && (
                <p className="text-sm text-destructive mt-1">{errors.accountDetails.message}</p>
              )}
            </div>
            <DialogFooter className="justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Submit Withdrawal"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawMoneyModal;