import React, { useReducer, useEffect, useCallback, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { toast } from "@/hooks/use-toast";
import WalletCard from "@/components/wallet/WalletCard";
import TransactionTable from "@/components/wallet/TransactionTable";
import AddMoneyModal from "@/components/wallet/AddMoneyModal";
import WithdrawMoneyModal from "@/components/wallet/WithdrawMoneyModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { loginWallet, type Transaction } from "../services/api";
import { walletReducer } from "../reducers/walletReducer";

interface WalletState {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  addMoneyOpen: boolean;
  withdrawMoneyOpen: boolean;
  emailModalOpen: boolean;
  email: string;
  isAuthenticated: boolean;
}

const initialState: WalletState = {
  balance: 0,
  transactions: [],
  loading: false,
  addMoneyOpen: false,
  withdrawMoneyOpen: false,
  emailModalOpen: false,
  email: '',
  isAuthenticated: false
};

const WalletPage = () => {
  const [state, dispatch] = useReducer(walletReducer, initialState);
  console.log('[WalletPage] Render state:', state);

  const { 
    balance,
    transactions,
    loading,
    addMoneyOpen,
    withdrawMoneyOpen,
    emailModalOpen,
    email,
    isAuthenticated 
  } = state;




  const navigate = useNavigate();

  // Memoize loadWallet function
  const loadWallet = useCallback(async () => {
    const emailToUse = email || localStorage.getItem("walletEmail");
    if (!emailToUse) {
      dispatch({ type: 'SHOW_EMAIL_MODAL', payload: true });
      return;
    }
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const wallet = await loginWallet(emailToUse);
      dispatch({
        type: 'SET_WALLET_DATA',
        payload: {
          email: wallet.email,
          balance: wallet.balance,
          transactions: wallet.transactions,
          isAuthenticated: true
        }
      });
    } catch (error) {
      localStorage.removeItem("walletEmail");
      dispatch({ type: 'SHOW_EMAIL_MODAL', payload: true });
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to load wallet"
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [email]);

  // Load wallet data on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("walletEmail");
    if (storedEmail && !email) {
      dispatch({ type: 'SET_EMAIL', payload: storedEmail });
      void loadWallet();
    } else if (!storedEmail) {
      dispatch({ type: 'SHOW_EMAIL_MODAL', payload: true });
    }
    // eslint-disable-next-line
  }, []);

  // Memoize form submission handler
  const handleEmailSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    if (import.meta.env.MODE === 'production') {
      console.log('[WalletPage] handleEmailSubmit called');
    }
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast({
        variant: "destructive",
        description: "Please enter a valid email",
      });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const wallet = await loginWallet(trimmedEmail);
      if (import.meta.env.MODE === 'production') {
        console.log('[WalletPage] API wallet response:', wallet);
      }
      localStorage.setItem("walletEmail", trimmedEmail);
      dispatch({
        type: 'SET_WALLET_DATA',
        payload: {
          email: wallet.email,
          balance: wallet.balance,
          transactions: wallet.transactions,
          isAuthenticated: true
        }
      });
      // DEBUG: Log state after dispatch
      setTimeout(() => {
        console.log('[WalletPage] After dispatch SET_WALLET_DATA:', state);
      }, 0);
      // Ensure modal closes after successful login
      dispatch({ type: 'SHOW_EMAIL_MODAL', payload: false });
      toast({
        description: "Successfully logged into wallet",
      });
    } catch (error) {
      localStorage.removeItem("walletEmail");
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to load wallet"
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [email]);



  const onAddMoneySuccess = useCallback((amount: number, transaction: Transaction) => {
    dispatch({ 
      type: 'ADD_TRANSACTION', 
      payload: { amount, transaction } 
    });
    toast({
      description: `Added ₹${amount.toFixed(2)} to your wallet.`,
    });
  }, []);

  const onWithdrawMoneySuccess = useCallback((amount: number, transaction: Transaction) => {
    dispatch({ 
      type: 'WITHDRAW', 
      payload: { amount, transaction } 
    });
    toast({
      description: `Withdrawn ₹${amount.toFixed(2)} from your wallet.`,
    });
  }, []);

  // Memoize modal handlers
  const handleEmailModalChange = useCallback((open: boolean) => {
    dispatch({ type: 'SHOW_EMAIL_MODAL', payload: open });
  }, []);

  const handleAddMoneyModalChange = useCallback((open: boolean) => {
    dispatch({ type: 'TOGGLE_ADD_MONEY_MODAL', payload: open });
  }, []);

  const handleWithdrawModalChange = useCallback((open: boolean) => {
    dispatch({ type: 'TOGGLE_WITHDRAW_MODAL', payload: open });
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_EMAIL', payload: e.target.value });
  }, []);

  const handleRefresh = useCallback(() => {
    void loadWallet();
  }, [loadWallet]);

  // Memoize content sections
  const walletContent = useMemo(() => (
    <div className="space-y-8">
      <WalletCard 
        balance={balance}
        email={email}
        transactions={transactions}
        isLoading={loading}
        onRefresh={handleRefresh}
        onAddMoney={() => handleAddMoneyModalChange(true)}
        onWithdrawMoney={() => handleWithdrawModalChange(true)}
      />
      <TransactionTable transactions={transactions} />
    </div>
  ), [balance, email, transactions, loading, handleRefresh]);

  const loadingContent = useMemo(() => (
    <div className="flex justify-center items-center h-[50vh]">
      <p className="text-lg text-gray-500">Loading wallet...</p>
    </div>
  ), []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 min-h-[calc(100vh-80px)] max-w-5xl space-y-8">
        <h1 className="text-3xl font-bold text-center">Wallet</h1>
        
        {loading ? loadingContent : isAuthenticated ? walletContent : <div style={{color:'red',textAlign:'center',marginTop:40}}>Wallet page fallback: Not authenticated or no wallet data.<br/>Try reloading and submitting your email again.</div>}

        <Dialog open={emailModalOpen} onOpenChange={handleEmailModalChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Email</DialogTitle>
              <DialogDescription>
                Please enter your email to access your wallet.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
                disabled={loading}
              />
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Continue"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AddMoneyModal
          open={addMoneyOpen}
          onOpenChange={handleAddMoneyModalChange}
          onSuccess={onAddMoneySuccess}
          email={email}
        />

        <WithdrawMoneyModal
          open={withdrawMoneyOpen}
          onOpenChange={handleWithdrawModalChange}
          onSuccess={onWithdrawMoneySuccess}
          email={email}
          balance={balance}
        />
      </div>
    </Layout>
  );
};

export default WalletPage;
