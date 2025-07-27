"use client"
import { Button } from '@/components/ui/button';
import { Layout, Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import React from 'react';
import UploadPdfDialog from './UploadPdfDialog';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

function Sidebar() {
  const { user } = useUser();
  const path=usePathname();
  const GetUserInfo=useQuery(api.user.GetUserInfo,{
    userEmail:user?.primaryEmailAddress?.emailAddress
  })


    const fileList = useQuery(api.fileStorage.GetUserFiles, {
      userEmail: user?.primaryEmailAddress?.emailAddress,
    });
  return (
    <div className="w-64 h-screen p-6 bg-white shadow-md flex flex-col justify-between relative">
      {/* Top Section */}
      <div>
        <div className="flex justify-center mb-6">
          <Image src="/logo.svg" alt="logo" width={60} height={60} />
        </div>

        <UploadPdfDialog isMaxFile={(fileList?.length>=10&&!GetUserInfo.upgrade)?true:false}>
          <Button className="w-full text-sm font-medium mt-10">+ Upload PDF File</Button>
        </UploadPdfDialog>
         <div className="mt-10 space-y-2">
          <Link href="/dashboard">
          <div>
          <SidebarItem
            icon={<Layout size={18} />}
            label="Workspace"
            active={path === "/dashboard"}
          />
          </div>
          </Link>

          <Link href="/dashboard/upgrade">
          <div>
          <SidebarItem
            icon={<Shield size={18} />}
            label="Upgrade"
            active={path === "/dashboard/upgrade"}
          />
          </div>
          </Link>
        </div>
      </div>

      {/* Bottom Progress */}
      {!GetUserInfo?.upgrade && <div className="mb-4">
        <Progress value={(fileList?.length/10)*100} className="w-[90%]" />
        <p className="text-xs mt-2 font-medium">{fileList?.length} out of 10 PDFs Uploaded</p>
        <p className="text-xs text-gray-400 mt-1">Upgrade to upload more PDFs</p>
      </div>}
    </div>
  );
}

function SidebarItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center font-bold gap-4 p-5 rounded-md cursor-pointer transition-colors
        ${active ? "bg-slate-200" : "hover:bg-slate-100"}
      `}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}

export default Sidebar;
