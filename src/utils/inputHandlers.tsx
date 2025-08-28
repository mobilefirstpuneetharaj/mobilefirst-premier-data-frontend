import React from "react";

export const preventSpace = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === " ") {
    e.preventDefault();
  }
};