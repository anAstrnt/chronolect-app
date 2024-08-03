"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

type Users = {
  userName: string;
  avatar: string;
};

type FamilyCardContextProps = {
  avatar: string;
  setAvatar: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  users: Users[];
  setUsers: React.Dispatch<React.SetStateAction<Users[]>>;
  hasUserData: boolean;
  setHasUserData: React.Dispatch<React.SetStateAction<boolean>>;
  openInputSpace: boolean;
  setOpenInputSpace: React.Dispatch<React.SetStateAction<boolean>>;
};

type FamilyCardProviderProps = {
  children: ReactNode;
};

const FamilyCardContext = createContext<FamilyCardContextProps | undefined>(undefined);

const FamilyCardProvider: React.FC<FamilyCardProviderProps> = ({ children }) => {
  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState<Users[]>([]);
  const [hasUserData, setHasUserData] = useState(false);
  const [openInputSpace, setOpenInputSpace] = useState(false);

  return (
    <FamilyCardContext.Provider
      value={{
        avatar,
        setAvatar,
        userName,
        setUserName,
        users,
        setUsers,
        hasUserData,
        setHasUserData,
        openInputSpace,
        setOpenInputSpace,
      }}
    >
      {children}
    </FamilyCardContext.Provider>
  );
};

const useFamilyCard = () => {
  const context = useContext(FamilyCardContext);
  if (context === undefined) {
    throw new Error("useFamilyCard は FamilyCardProvider 内で使用する必要があります。");
  }
  return context;
};

export { useFamilyCard, FamilyCardProvider };
