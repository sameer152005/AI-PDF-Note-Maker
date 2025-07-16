import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import React from 'react';

function WorkspaceHeader({ fileName, onSave }) {
  const handleSave = () => {
    if (onSave) {
      onSave(); 
    } else {
      console.log('No save handler provided');
    }
  };

  return (
    <div className="relative flex items-center h-16 border-b shadow-sm bg-white px-4">
      
      {/* Left: Logo */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
        <Image src="/logo.svg" alt="logo" width={44} height={44} />
      </div>

      {/* Center: File Name */}
      <div className="absolute left-1/2 top-11 -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-lg font-semibold text-gray-800 truncate max-w-[60vw] text-center">
          {fileName}
        </h2>
      </div>

      {/* Right: Save Button + Avatar */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
          <UserButton />
        </div>
      </div>
    </div>
  );
}

export default WorkspaceHeader;
