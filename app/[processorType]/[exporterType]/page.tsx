import { Component } from "../../../component";

export const revalidate = 0;

export default function Page({ params: { processorType, exporterType } }) {
  return (
    <Component processorType={processorType} exporterType={exporterType} />
  );
}
