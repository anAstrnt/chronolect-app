import React from "react";
import AddTodoAria from "./AddTodoAria/page";
import ShowTodoAria from "./ShowTodoAria/page";
import BackToPageButton from "@/components/BackToPageButton";

const page = () => {
  return (
    <>
      <BackToPageButton />
      <AddTodoAria />
      <ShowTodoAria />
    </>
  );
};

export default page;
