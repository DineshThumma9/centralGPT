import {
  FileUpload,
  Button
} from "@chakra-ui/react";
import { IoAttach } from "react-icons/io5";
import type {ReactNode} from "react";
import useSessionStore from "../store/sessionStore.ts";
import FileUploadList from "./FileItem.tsx";

interface Props {
  children: ReactNode;
}

const MediaPDF = ({ children }: Props) => {
  const { addFiles } = useSessionStore();

  return (
    <FileUpload.Root

      maxFiles={5}
       onFileChange={({ acceptedFiles }) => {
    acceptedFiles.forEach(addFiles);
  }}
      justifyContent={"flex-start"}
    >
      <FileUploadList />
      <FileUpload.HiddenInput />
      {children}
      <FileUpload.Trigger asChild>
        <Button size="md" bg="transparent" color="white" border="0px">
          <IoAttach />
        </Button>
      </FileUpload.Trigger>
    </FileUpload.Root>
  );
};

export default MediaPDF;
