/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_REACT_APP_API_URL: string;
  readonly DEV: string;
}

const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:3000'
  : (import.meta.env.VITE_REACT_APP_API_URL || 'https://healthoasis-backendf.onrender.com');

export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  timestamp: string;
}

export interface WalletData {
  email: string;
  balance: number;
  transactions: Transaction[];
}

export interface WalletResponse {
  message: string;
  token: string;
  wallet: WalletData;
}

export const loginWallet = async (email: string): Promise<WalletData> => {
  try {
    console.log('[API] Attempting to login with email:', email);
    const response = await fetch(`${API_BASE_URL}/api/wallet/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      console.error('[API] Response not OK:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      try {
        const errorData = await response.json();
        console.error('[API] Login failed:', errorData);
        throw new Error(errorData.message || 'Failed to login to wallet');
      } catch (parseError) {
        console.error('[API] Could not parse error response:', parseError);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
    }

    const data: WalletResponse = await response.json();
    console.log('[API] Login successful:', data);

    // Store token for future requests
    localStorage.setItem('walletToken', data.token);

    // Return wallet data
    return {
      email: data.wallet.email,
      balance: Number(data.wallet.balance),
      transactions: data.wallet.transactions.map(tx => ({
        ...tx,
        amount: Number(tx.amount)
      }))
    };
  } catch (error) {
    console.error('[API] Error in loginWallet:', error);
    throw error;
  }
};
