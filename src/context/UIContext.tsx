"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isSignInOpen: boolean;
  isSignUpOpen: boolean;
  openSignInModal: () => void;
  closeSignInModal: () => void;
  openSignUpModal: () => void;
  closeSignUpModal: () => void;
  switchToSignUp: () => void; // For switching from sign-in to sign-up
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const openSignInModal = () => setIsSignInOpen(true);
  const closeSignInModal = () => setIsSignInOpen(false);
  
  const openSignUpModal = () => setIsSignUpOpen(true);
  const closeSignUpModal = () => setIsSignUpOpen(false);

  // This function closes the sign-in modal and immediately opens the sign-up modal
  const switchToSignUp = () => {
    closeSignInModal();
    openSignUpModal();
  };

  return (
    <UIContext.Provider value={{ 
        isSignInOpen, 
        isSignUpOpen, 
        openSignInModal, 
        closeSignInModal, 
        openSignUpModal, 
        closeSignUpModal,
        switchToSignUp
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};