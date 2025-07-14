// "use client";

// import type React from "react";


import { useState } from "react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
<<<<<<< Updated upstream
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  IdCard, 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  ArrowLeft
} from "lucide-react";


// import { Metadata, ResolvingMetadata } from 'next'

// type Props = {
//   params: { id: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }


// // Simulated database fetch
// async function getCards() {
//   // In a real app, you would fetch from your database/API
//   return [
//     { id: 'CARD001', owner: 'John Doe', balance: 150.00, status: 'Active', lastUsed: '2023-05-15' },
//     { id: 'CARD002', owner: 'Jane Smith', balance: 75.50, status: 'Active', lastUsed: '2023-05-10' },
//     { id: 'CARD003', owner: 'Robert Johnson', balance: 0.00, status: 'Inactive', lastUsed: '2023-04-28' },
//     { id: 'CARD004', owner: 'Emily Davis', balance: 200.00, status: 'Active', lastUsed: '2023-05-14' },
//   ];
// }

// export default async function RfidCardManagement({ searchParams }: Props) {
//   const cards = await getCards();
//   const searchTerm = searchParams?.search || '';

//   const filteredCards = cards.filter(card =>
//     card.id.toLowerCase() ||
//     card.owner.toLowerCase()
//   );

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold flex items-center gap-2">
//             <IdCard className="h-6 w-6" />
//             RFID Card Management
//           </h1>
//           <p className="text-muted-foreground">
//             Register new cards or manage existing cards
//           </p>
//         </div>
//         <Button asChild>
//           <Link href="/admin/manage/new" className="flex items-center gap-2">
//             <PlusCircle className="h-4 w-4" />
//             Register New Card
//           </Link>
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <div>
//               <CardTitle>Registered Cards</CardTitle>
//               <CardDescription>
//                 {cards.length} cards in the system
//               </CardDescription>
//             </div>
//             <form>
//               <div className="relative w-64">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search cards..."
//                   className="pl-10"
//                   name="search"
//                   defaultValue={searchTerm}
//                 />
//               </div>
//             </form>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Card ID</TableHead>
//                 <TableHead>Owner</TableHead>
//                 <TableHead>Balance</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Last Used</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredCards.length > 0 ? (
//                 filteredCards.map((card) => (
//                   <TableRow key={card.id}>
//                     <TableCell className="font-medium">{card.id}</TableCell>
//                     <TableCell>{card.owner}</TableCell>
//                     <TableCell>${card.balance.toFixed(2)}</TableCell>
//                     <TableCell>
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         card.status === 'Active' 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {card.status}
//                       </span>
//                     </TableCell>
//                     <TableCell>{card.lastUsed}</TableCell>
//                     <TableCell className="text-right space-x-2">
//                       <Button variant="outline" size="sm" asChild>
//                         <Link href={`/admin/manage/edit/${card.id}`}>
//                           <Edit className="h-4 w-4 mr-2" />
//                           Edit
//                         </Link>
//                       </Button>
//                       <Button 
//                         variant="destructive" 
//                         size="sm"
//                         asChild
//                       >
//                         <Link href={`/admin/manage/delete/${card.id}`}>
//                           <Trash2 className="h-4 w-4 mr-2" />
//                           Delete
//                         </Link>
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
//                     No cards found matching your search
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <div className="text-sm text-muted-foreground">
//             Showing {filteredCards.length} of {cards.length} cards
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Smartphone, UserCog } from "lucide-react"

export default function RFIDManagement() {
  return (
=======
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IdCard, ArrowLeft, CreditCard } from "lucide-react";
import IssueNewCard from "./IssueNewCard";
import ManageExistingCard from "./ManageExistingCard";
import { UserCog } from "lucide-react";
import DeviceStatus from "@/components/DeviceStatus";
import AddMenu from "./AddMenu";

export default function RFIDManagement() {
    const [showIssueNew, setShowIssueNew] = useState(true);
    return (
        <>
            <div className="container mx-auto">
                
                <div className="p-6 space-y-6">
                    <div className="w-full grid items-center grid-cols-2 justify-around">
                        <div className="flex">
                            <Link href="/admin/dashboard" className="mr-4">
                                <Button variant="outline" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    <IdCard className="h-6 w-6" />
                                    RFID Card Management
                                </h1>
                                <p className="text-muted-foreground">
                                    Register new cards or manage existing cards
                                </p>
                            </div>
                        </div>
                        <div className="ml-auto">
                            <DeviceStatus/>
                            
                        </div>
                    </div>
                   
                    {/* Add new | Manage Existing Card */}
                    <div className="grid grid-cols-2 gap-6">
                        <Card
                            className={`h-full transition-all cursor-pointer hover:shadow-lg ${
                                showIssueNew
                                    ? "bg-gray-100 dark:bg-gray-900"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-900"
                            }`}
                            onClick={() => setShowIssueNew(true)}
                        >
                            <CardHeader>
                                <CreditCard className="h-8 w-8 text-primary" />
                                <CardTitle className="mt-2">
                                    Issue New RFID Card
                                </CardTitle>
                                <CardDescription>
                                    Add new card to a new user
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Search by card ID or student name
                                </p>
                            </CardContent>
                        </Card>
>>>>>>> Stashed changes

    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Link href="/admin/dashboard" className="mr-4">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <IdCard className="h-6 w-6" />
            RFID Card Management
          </h1>
          <p className="text-muted-foreground">
            Register new cards or manage existing cards
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/manage/new" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Register New Card
          </Link>
        </Button>
      </div>

        {/* Manage Existing Card */}
        <Link href="/admin/rfid/manage-existing">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <UserCog className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">Manage Existing Card</CardTitle>
              <CardDescription>Update or view existing card details</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Search by card ID or student name
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}