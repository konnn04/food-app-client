import React from "react";
import useAuth from "@/hooks/useAuth";
import CustomerHome from "./CustomerHome";
import StaffHome from "./StaffHome";

export default function Home() {
  const { isCustomer, currentUser } = useAuth();

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  if (isCustomer) {
    return <CustomerHome />;
  } else {
    return <StaffHome />;
  }
}