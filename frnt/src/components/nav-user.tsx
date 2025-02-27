"use client"
import axios from "axios";
import { useState, useEffect } from "react"
import {
  BadgeCheck, 
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from "next/link"
import { MdCancel } from "react-icons/md"
import { useRouter } from "next/navigation";


interface Owner {
  _id: string;
  logo: string;
  companyName: string;
  ownerName: string;
  contactNumber: string;
  emailAddress: string;
  website: string;
  businessRegistration: "Sole proprietorship" | "One person Company" | "Partnership" | "Private Limited";
  companyType: string;
  employeeSize: "1-10" | "11-50" | "51-100" | ">100";
  panNumber: string;
  documentType: "GST Number" | "UdhayamAadhar Number" | "State Certificate" | "Certificate of Incorporation";
  gstNumber: string;
  udhayamAadhar: string;
  stateCertificate: string;
  incorporationCertificate: string;
}
export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const [open, setOpen] = useState(false) // State for modal
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
    const [owners,setOwners]  = useState<Owner[]>([]);
    const [filteredOwners, setFilteredOwners] = useState<Owner[]>([]);
    const router = useRouter();

  useEffect(() => {
    const fetchOwners = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/v1/owner/getAllOwners");
            setOwners(response.data.data);
            setFilteredOwners(response.data.data); // Update filteredOwners
        } catch (err) {
            console.error("Error fetching owners:", err);
        } finally {
            setLoading(false);
        }
    };

    fetchOwners();
}, []);
  

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name}/>
                  <AvatarFallback className="rounded-lg">RR</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuItem>
                <LogOut />
                <Link href="/login">Log out</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Clickable User Info */}
              <button onClick={() => setOpen(true)} className="w-full text-left">
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.avatar} alt={user.name}/>
                      <AvatarFallback className="rounded-lg">RR</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user.name}</span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>User Details</DialogTitle>
      <DialogDescription>
         {filteredOwners.length > 0 ? (
                    filteredOwners.map((owner) => (
                      <div key={owner._id} className="border border-gray-200 rounded-lg shadow-lg p-6 bg-white hover:shadow-xl transition-shadow duration-300">
                        <button
                              type="button"
                              onClick={() => window.history.back()}
                              className="text-gray-600 hover:text-red-500"
                            >
                              <MdCancel size={24} />
                            </button>
                        <div className="flex items-center justify-center mb-6">
                          {owner.logo ? (
                            <img src={owner.logo} alt="" className="w-24 h-24 object-contain rounded-full border border-gray-300" />
                          ) : (
                            <div className="w-24 h-24 bg-gray-300 flex items-center justify-center text-gray-700 rounded-full border border-gray-300">
                              No Logo
                            </div>
                          )}
                        </div>
              
                        <div className="space-y-3 text-gray-700">
                          <p className="text-lg font-medium"><strong>Company Name:</strong> {owner.companyName}</p>
                          <p><strong>Owner Name:</strong> {owner.ownerName}</p>
                          <p><strong>Email:</strong> {owner.emailAddress}</p>
                          <p><strong>Contact:</strong> {owner.contactNumber}</p>
                          <p>
                            <strong>Website:</strong>{" "}
                            <a href={owner.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">
                              {owner.website}
                            </a>
                          </p>
                          <p><strong>Business Registration:</strong> {owner.businessRegistration}</p>
                          <p><strong>Company Type:</strong> {owner.companyType}</p>
                          <p><strong>Employee Size:</strong> {owner.employeeSize}</p>
                          <p><strong>PAN Number:</strong> {owner.panNumber}</p>
              
                          {owner.documentType === "GST Number" && <p><strong>GST Number:</strong> {owner.gstNumber}</p>}
                          {owner.documentType === "UdhayamAadhar Number" && <p><strong>Udhayam Aadhar:</strong> {owner.udhayamAadhar}</p>}
                          {owner.documentType === "State Certificate" && <p><strong>State Certificate:</strong> {owner.stateCertificate}</p>}
                          {owner.documentType === "Certificate of Incorporation" && (
                            <p><strong>Incorporation Certificate:</strong> {owner.incorporationCertificate}</p>
                          )}
              
                          <div className="flex justify-end mt-6">
                            <button
                              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                onClick={() => router.push(`/Profile/${owner._id}`)} // Redirect to profile page
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-600 text-lg">No owners found for the given email.</p>
                  )}
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

    </>
  )
}
