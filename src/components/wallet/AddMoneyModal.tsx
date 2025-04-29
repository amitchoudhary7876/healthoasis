import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from './StripeCheckoutForm';

interface AddMoneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (amount: number, transaction: any) => void;
}

interface AddMoneyFormData {
  email: string;
  amount: string;
}

const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ open, onOpenChange, onSuccess }) => {
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<any>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AddMoneyFormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: AddMoneyFormData) => {
    const amountNum = parseFloat(data.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid amount greater than zero.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // Call backend API to create Stripe Checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, amount: Math.round(amountNum * 100) })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.message || 'Failed to create checkout session');
      }
      const responseData = await response.json();
      // Redirect to Stripe Checkout if url is present
      if (responseData.url) {
        window.location.href = responseData.url;
      } else {
        throw new Error('Stripe Checkout URL missing in response');
      }
    } catch (error: any) {
      toast({ title: "Payment failed", description: error.message || "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
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
          {!showStripeForm ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <DialogHeader>
                <DialogTitle>Add Money</DialogTitle>
              </DialogHeader>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Invalid email address" }
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="amount">Amount (INR)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  {...register("amount", {
                    required: "Amount is required",
                    min: { value: 0.01, message: "Amount must be at least ₹0.01" },
                  })}
                />
                {errors.amount && (
                  <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>
                )}
              </div>
              <DialogFooter className="justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Processing..." : "Proceed to Pay"}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            stripeClientSecret && stripePromise && (
              <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
                <StripeCheckoutForm clientSecret={stripeClientSecret} onSuccess={() => {
                  setShowStripeForm(false);
                  setStripeClientSecret(null);
                  setStripePromise(null);
                  reset();
                  onOpenChange(false);
                  toast({ title: "Payment successful!" });
                }} />
              </Elements>
            )
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMoneyModal;