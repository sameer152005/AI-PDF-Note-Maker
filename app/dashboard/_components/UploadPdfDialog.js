"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { useAction, useMutation } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { api } from "@/convex/_generated/api";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";

function UploadPdfDialog({ children }) {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embeddDocument = useAction(api.myAction.ingest);
  const { user } = useUser();

  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [open, setOpen] = useState(false);

  const onFileSelect = (event) => {
    setFile(event.target.files[0]);
  };

  const OnUpload = async () => {
  if (!file || !fileName) return;

  setLoading(true);

  try {
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file?.type },
      body: file,
    });

    const { storageId } = await result.json();
    const fileId = uuid4();
    const fileUrl = await getFileUrl({ storageId });

    await addFileEntry({
      fileId,
      storageId,
      fileName: fileName ?? "Untitled File",
      fileUrl,
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });

    const apiResp = await axios.get("/api/pdf-loader?pdfUrl=" + fileUrl);

    await embeddDocument({
      splitText: apiResp.data.result,
      fileId,
    });

    setOpen(false);

    // ✅ Colored toasts after success
    setTimeout(() => {
  toast.success("✅ File uploaded successfully!", {
    style: {
      backgroundColor: "#DCFCE7",
      color: "#166534",
      border: "1px solid #bbf7d0",
    },
  });
}, 1000);

// ✅ Show description toast after 2 seconds
setTimeout(() => {
  toast("Upload complete", {
    style: {
      backgroundColor: "#E0F2FE",      // light blue background
      color: "#075985",                // text color (dark blue)
      border: "1px solid #bae6fd",     // border
    },
  });
}, 2000);

  } catch (err) {
    console.error("Upload failed", err);

    // ❌ Colored error toast
    toast.error("❌ Upload failed. Please try again.", {
      style: {
        backgroundColor: "#FEE2E2",
        color: "#991B1B",
        border: "1px solid #fecaca",
      },
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} className="w-full">
          + Upload PDF File
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-full rounded-lg p-4">
  <DialogHeader className="p-0 mb-2">
    <DialogTitle className="text-lg font-semibold text-gray-900 leading-none">
      Upload PDF File
    </DialogTitle>
  </DialogHeader>

  <DialogDescription asChild>
    <div className="space-y-3">
      {/* PDF File Selector */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Select a file
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={onFileSelect}
          className="w-full text-sm border border-gray-300 rounded-md px-4 py-2 bg-gray-50 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-black file:text-white hover:file:bg-gray-800"
        />
      </div>

      {/* File Name Input */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          File Name <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="Enter file name"
          onChange={(e) => setFileName(e.target.value)}
          className="text-sm"
        />
      </div>
    </div>
  </DialogDescription>

  <DialogFooter className="flex justify-end gap-2 pt-4">
    <DialogClose asChild>
      <Button variant="outline" type="button" className="text-sm px-4 py-2">
        Close
      </Button>
    </DialogClose>
    <Button
      onClick={OnUpload}
      disabled={loading || !file || !fileName}
      className="text-sm px-4 py-2"
    >
      {loading ? (
        <>
          <Loader2Icon className="animate-spin w-4 h-4 mr-2" />
          Uploading...
        </>
      ) : (
        "Upload"
      )}
    </Button>
  </DialogFooter>
</DialogContent>


    </Dialog>
  );
}

export default UploadPdfDialog;
