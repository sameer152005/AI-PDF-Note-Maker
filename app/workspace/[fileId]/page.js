"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import WorkspaceHeader from '../_components/WorkspaceHeader';
import PdfViewer from '../_components/PdfViewer';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import TextEditor from '../_components/TextEditor';

function Workspace() {
  const { fileId } = useParams();

  const fileInfo = useQuery(api.fileStorage.GetFileRecord, {
    fileId: fileId
  });

  // Ref to access child component method
  const editorRef = useRef();

  useEffect(() => {
  }, [fileInfo]);

  const handleSave = () => {
    if (editorRef.current && editorRef.current.saveContent) {
      editorRef.current.saveContent();
    } else {
      console.warn("TextEditor ref or saveContent not defined");
    }
  };

  return (
    <div>
      <WorkspaceHeader fileName={fileInfo?.fileName} onSave={handleSave} />
      
      <div className="grid grid-cols-2 gap-5">
        <div>
          {/* Text Editor with ref */}
          <TextEditor fileId={fileId} ref={editorRef} />
        </div>
        <div>
          {/* PDF Viewer */}
          <PdfViewer fileUrl={fileInfo?.fileUrl} />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
