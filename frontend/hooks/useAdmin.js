import { useState, useEffect } from 'react';
import { account } from '../lib/appwrite';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    account.get().then(user => {
      setIsAdmin(user.prefs?.role === 'admin');
    }).catch(() => setIsAdmin(false));
  }, []);

  return isAdmin;
}