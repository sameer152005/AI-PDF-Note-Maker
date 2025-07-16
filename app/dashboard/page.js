"use client";
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import Image from 'next/image';
import React, { useEffect } from 'react';
import Link from 'next/link';

function Dashboard() {
  const { user } = useUser();

  // 🔹 1. Get mutation hook
  const createUser = useMutation(api.user.createUser);

  // 🔹 2. Call createUser once when Clerk user is available
  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const syncUser = async () => {
      try {
        const res = await createUser({
          email: user.primaryEmailAddress.emailAddress,
          userName: user.fullName || user.username || "NoName",
          imageUrl: user.imageUrl,
        });
        console.log("🔁 createUser result:", res);
      } catch (error) {
        console.error("❌ Error calling createUser:", error);
      }
    };

    syncUser();
  }, [user?.id]); // Run once when user is available

  // 🔹 3. Your original query still works
  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-6">Workspace</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {fileList?.length > 0
          ? fileList.map((file, index) => (
              <Link
                key={index}
                href={`/workspace/` + file.fileId}
                className="p-5 rounded-xl border shadow-sm bg-white flex flex-col items-center justify-center hover:shadow-lg hover:scale-[1.03] transition-all duration-200 ease-in-out"
              >
                <Image src="/pdf.png" alt="file" width={60} height={60} />
                <h3 className="mt-4 text-center text-base font-medium text-gray-800 truncate w-full">
                  {file.fileName}
                </h3>
              </Link>
            ))
          : [1, 2, 3, 4, 5, 6].map((_, index) => (
              <div
                key={index}
                className="h-[160px] rounded-xl bg-slate-100 animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default Dashboard;
