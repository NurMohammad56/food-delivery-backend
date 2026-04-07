import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';

export const AppProvider = ({ children }) => (
  <AuthProvider>
    <CartProvider>{children}</CartProvider>
  </AuthProvider>
);
