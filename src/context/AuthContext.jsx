import React, { createContext, useContext, useState, useEffect } from 'react';
import { insforge } from '../lib/insforge';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customDrinks, setCustomDrinks] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Check initial user state
    const checkUser = async () => {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (data?.user) {
          setUser(data.user);
          await fetchUserData(data.user.id);
        }
      } catch (err) {
        console.error('Error checking user:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const { data: drinks } = await insforge.database
        .from('drinks')
        .select('*')
        .eq('user_id', userId);
      
      const { data: userOrders } = await insforge.database
        .from('orders')
        .select('*')
        .eq('user_id', userId);

      setCustomDrinks(drinks || []);
      setOrders(userOrders || []);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const signup = async (userData) => {
    const { data, error } = await insforge.auth.signUp({
      email: userData.email,
      password: userData.password,
      name: userData.name, // The SDK accepts name directly based on types
      enterprise: userData.enterprise
    });
    
    if (error) throw error;
    
    if (data?.user) {
      setUser(data.user);
      await fetchUserData(data.user.id);
    }
    return data;
  };

  const login = async (email, password) => {
    const { data, error } = await insforge.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    if (data?.user) {
      setUser(data.user);
      await fetchUserData(data.user.id);
    }
    return data;
  };

  const logout = async () => {
    const { error } = await insforge.auth.signOut();
    if (error) throw error;
    setUser(null);
    setCustomDrinks([]);
    setOrders([]);
  };

  const addCustomDrink = async (drink) => {
    const { data, error } = await insforge.database
      .from('drinks')
      .insert([{ ...drink, user_id: user.id, is_custom: true }])
      .select();
    
    if (error) throw error;
    setCustomDrinks([...customDrinks, data[0]]);
  };

  const removeCustomDrink = async (id) => {
    const { error } = await insforge.database
      .from('drinks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    setCustomDrinks(customDrinks.filter(d => d.id !== id));
  };

  const addOrder = async (orderData) => {
    const { data, error } = await insforge.database
      .from('orders')
      .insert([{ 
        user_id: user.id, 
        total: orderData.total, 
        items: orderData.items 
      }])
      .select();
    
    if (error) throw error;
    setOrders([...orders, data[0]]);
    return data[0];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signup, 
      login, 
      logout, 
      loading, 
      customDrinks, 
      orders, 
      addCustomDrink, 
      removeCustomDrink, 
      addOrder 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
