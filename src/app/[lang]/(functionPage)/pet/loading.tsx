import React from "react";
import LoadingBox from "../../_components/loadingBox";

export default function PetLoading() {
  return (
    <div className="LoadingModule w-full h-full flex justify-center items-center backdrop-blur">
      <LoadingBox className=" w-2/3" />
    </div>
  );
}
