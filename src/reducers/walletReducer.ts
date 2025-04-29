import { Transaction } from '../services/api';

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

type WalletAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SHOW_EMAIL_MODAL'; payload: boolean }
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_WALLET_DATA'; payload: { email: string; balance: number; transactions: Transaction[]; isAuthenticated: boolean } }
  | { type: 'TOGGLE_ADD_MONEY_MODAL'; payload: boolean }
  | { type: 'TOGGLE_WITHDRAW_MODAL'; payload: boolean }
  | { type: 'ADD_TRANSACTION'; payload: { amount: number; transaction: Transaction } }
  | { type: 'WITHDRAW'; payload: { amount: number; transaction: Transaction } };

export const walletReducer = (state: WalletState, action: WalletAction): WalletState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SHOW_EMAIL_MODAL':
      return { 
        ...state, 
        emailModalOpen: action.payload,
        isAuthenticated: false 
      };
      
    case 'SET_EMAIL':
      return { 
        ...state, 
        email: action.payload 
      };
    
    case 'SET_WALLET_DATA':
      return {
        ...state,
        email: action.payload.email,
        balance: action.payload.balance,
        transactions: action.payload.transactions,
        isAuthenticated: action.payload.isAuthenticated,
        emailModalOpen: false,
        loading: false
      };
    
    case 'TOGGLE_ADD_MONEY_MODAL':
      return { ...state, addMoneyOpen: action.payload };
    
    case 'TOGGLE_WITHDRAW_MODAL':
      return { ...state, withdrawMoneyOpen: action.payload };
    
    case 'ADD_TRANSACTION':
      return {
        ...state,
        balance: state.balance + action.payload.amount,
        transactions: [action.payload.transaction, ...state.transactions]
      };
    
    case 'WITHDRAW':
      return {
        ...state,
        balance: state.balance - action.payload.amount,
        transactions: [action.payload.transaction, ...state.transactions]
      };
    
    default:
      return state;
  }
};
