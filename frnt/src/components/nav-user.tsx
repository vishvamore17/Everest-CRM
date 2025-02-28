"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Link from "next/link";
import { MdCancel } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

interface Owner {
  _id: string;
  logo?: string;
  companyName: string;
  ownerName: string;
  contactNumber: string;
  emailAddress: string;
  website?: string;
  businessRegistration?: string;
  companyType?: string;
  employeeSize?: string;
  panNumber?: string;
  documentType?: string;
  documentNumber?: string;
  gstNumber?: string;
  udhayamAadhar?: string;
  stateCertificate?: string;
  incorporationCertificate?: string;
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const [open, setOpen] = useState(false);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [editOwner, setEditOwner] = useState<Owner | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<Owner>({
    defaultValues: {
      companyName: '',
      ownerName: '',
      contactNumber: '',
      emailAddress: '',
      website: '',
      businessRegistration: '',
      companyType: '',
      employeeSize: '',
      panNumber: '',
      documentType: '',
      documentNumber: '',
      gstNumber: '',
      udhayamAadhar: '',
      stateCertificate: '',
      incorporationCertificate: '',
    },
  });

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/v1/owner/getAllOwners");
        setOwners(response.data.data);

        const emailFromStorage = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
        if (emailFromStorage) {
          const filtered = response.data.data.filter((owner: Owner) => owner.emailAddress === emailFromStorage);
          setFilteredOwners(filtered);
        }
      } catch (err) {
        setError("Failed to fetch owners.");
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  const handleEditClick = (owner: Owner) => {
    setEditOwner(owner);
    setIsEditing(true);
    setOpen(false); // Close the dialog when editing starts
    form.reset(owner); // Reset form with owner data
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: Owner) => {
    setIsSubmitting(true);
    try {
      await axios.put(`http://localhost:8000/api/v1/owner/updateOwner/${editOwner?._id}`, data);
      setIsEditing(false);
      setEditOwner(null);
      const response = await axios.get("http://localhost:8000/api/v1/owner/getAllOwners");
      setOwners(response.data.data);
      setFilteredOwners(response.data.data.filter((owner: { emailAddress: string | null; }) => owner.emailAddress === localStorage.getItem("userEmail")));
    } catch (error) {
      console.error("Failed to update owner:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  const currentOwner = filteredOwners[0];

  return (
    <>
      {isEditing && editOwner ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Edit Owner</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div style={{ display: 'flex', flexDirection: 'column', padding: '50px', height: '100vh' }}>
                <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>Edit Profile</h1>
                <Separator className="my-4 border-gray-500 border-1" />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <label htmlFor="logo">
                      Logo
                      <br />
                      <img
                        src={logoPreview || 'https://via.placeholder.com/80'}
                        style={{ width: '80px', height: '80px', borderRadius: '50%', border: '1px solid #ccc' }}
                        alt="Logo Preview"
                      />
                    </label>
                    <input
                      type="file"
                      id="logo"
                      accept="image/*"
                      onChange={handleLogoChange}
                      style={{ display: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {isSubmitting ? 'Submitting...' : 'Save Owner'}
                    </Button>
                  </div>
                </div>

                <h2>Profile Information</h2>
                <br />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', flexGrow: 1 }}>
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Company Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Owner Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Contact Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emailAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Email Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Website URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="documentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Type</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Document Type</option>
                            <option value="GST Number">GST Number</option>
                            <option value="UdhyamAadhar Number">UdhyamAadhar Number</option>
                            <option value="State Certificate">State Certificate</option>
                            <option value="Certificate of Incorporation">Certificate of Incorporation</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('documentType') && (
                    <FormField
                      control={form.control}
                      name="documentNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{form.watch('documentType')}</FormLabel>
                          <FormControl>
                            <Input placeholder={`Enter ${form.watch('documentType')}`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="panNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pan Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Pan Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Type</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Company Type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employeeSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee Size</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Employee Size</option>
                            <option value="1-10">1-10</option>
                            <option value="11-50">11-50</option>
                            <option value="51-100">51-100</option>
                            <option value=">100">&gt;100</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessRegistration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Registration</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Business Registration</option>
                            <option value="Sole proprietorship">Sole proprietorship</option>
                            <option value="One person Company">One person Company</option>
                            <option value="Partnership">Partnership</option>
                            <option value="Private Limited">Private Limited</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={currentOwner?.logo} alt={currentOwner?.ownerName || "User"} />
                      <AvatarFallback className="rounded-lg">
                        {currentOwner?.ownerName?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{currentOwner?.ownerName || "User"}</span>
                      <span className="truncate text-xs">{currentOwner?.emailAddress || "No Email"}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
                  <DropdownMenuItem>
                    <LogOut />
                    <Link href="/login">Log out</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <button onClick={() => setOpen(true)} className="w-full text-left">
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={currentOwner?.logo} alt={currentOwner?.ownerName || "User"} />
                          <AvatarFallback className="rounded-lg">
                            {currentOwner?.ownerName?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">{currentOwner?.ownerName || "User"}</span>
                          <span className="truncate text-xs">{currentOwner?.emailAddress || "No Email"}</span>
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
                <DialogTitle>Profile Details</DialogTitle>
                <DialogDescription>
                  {loading ? (
                    <p className="text-center text-gray-600 text-lg">Loading...</p>
                  ) : error ? (
                    <p className="text-center text-red-600 text-lg">{error}</p>
                  ) : currentOwner ? (
                    <div>
                      <button type="button" onClick={() => setOpen(false)} className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
                        <MdCancel size={24} />
                      </button>
                      <div className="flex items-center justify-center mb-6">
                        {currentOwner.logo ? (
                          <img src={`http://localhost:8000/uploads/${currentOwner.logo}`} alt="Company Logo" className="w-24 h-24 object-contain rounded-full border border-gray-300" />
                        ) : (
                          <div className="w-24 h-24 bg-gray-300 flex items-center justify-center text-gray-700 rounded-full border border-gray-300">
                            No Logo
                          </div>
                        )}
                      </div>
                      <div className="space-y-3 text-gray-700">
                        <p className="text-lg font-medium"><strong>Company Name:</strong> {currentOwner.companyName}</p>
                        <p><strong>Owner Name:</strong> {currentOwner.ownerName}</p>
                        <p><strong>Email:</strong> {currentOwner.emailAddress}</p>
                        <p><strong>Contact:</strong> {currentOwner.contactNumber}</p>
                        {currentOwner.website && (
                          <p><strong>Website:</strong>
                            <a href={currentOwner.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                              {currentOwner.website}
                            </a>
                          </p>
                        )}
                        <p><strong>Document Type:</strong> {currentOwner.documentType}</p>
                        <p><strong>Document Number:</strong> {currentOwner.documentNumber || "N/A"}</p>
                        <p><strong>PAN Number:</strong> {currentOwner.panNumber}</p>
                        <p><strong>Business Registration:</strong> {currentOwner.businessRegistration}</p>
                        <p><strong>Company Type:</strong> {currentOwner.companyType}</p>
                        <p><strong>Employee Size:</strong> {currentOwner.employeeSize}</p>
                        <div className="flex justify-end mt-6">
                          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600" onClick={() => handleEditClick(currentOwner)}>
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 text-lg">No owners found.</p>
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}