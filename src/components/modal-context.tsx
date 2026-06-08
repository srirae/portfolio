"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type ModalType = "projects" | "experience" | "streak" | "resume" | "links" | null;

interface ModalContextType {
  activeModal: ModalType;
  setActiveModal: (type: ModalType) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ activeModal, setActiveModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
