import React, { useState } from "react";
import Comment from "./comment";

const Dashboard = ({project}) => {
  return (
    <>
      <div>
        <h2>Dashboard</h2>
      </div>
      <Comment project={project} />
    </>
  );
};

export default Dashboard;
