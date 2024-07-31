import React, { createContext, ReactNode, useContext, useState } from "react";

interface FamilyCardContextProps {
  avatar: string;
  setAvatar: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
}

interface FamilyCardProviderProps {
  children: ReactNode;
}

const FamilyCardContext = createContext<FamilyCardContextProps | undefined>(undefined);

const FamilyCardProvider: React.FC<FamilyCardProviderProps> = ({ children }) => {
  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");

  return (
    <FamilyCardContext.Provider value={{ avatar, setAvatar, userName, setUserName }}>
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

export { FamilyCardProvider, useFamilyCard };
