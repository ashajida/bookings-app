"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddServiceForm from "./AddCustomerForm";
import EditServiceForm from "./EditServiceForm";
import { DeleteServiceForm } from "./DeleteServiceForm";
import { findAllServices } from "@/lib/repository/service/service";
import { validateRequest } from "@/lib/validateRequest";
import { findAllCustomers } from "@/lib/repository/customer/customer";

type CustomerData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

const Service = () => {
  const [customers, setCustomers] = useState<[]>([]);
  const [open, setOpen] = useState(false);
  const [newServiceDialog, setNewServiceDialog] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({});

  useEffect(() => {
    const getCustomers = async () => {
      const { user } = await validateRequest();
        if (!user) return;

      const response = await findAllCustomers(user.business);
      if (!response) return;
      setCustomers(response);
    };

    getCustomers();

    return () => {
      setCustomerData([]);
    };
  }, []);

  return (
    <div className="container mx-auto">
      <div className="">
        <Button
          variant="outline"
          onClick={() => setNewServiceDialog(!newServiceDialog)}
        >
          Add Service
        </Button>
        {services && (
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">First Name</TableHead>
                <TableHead>LastName</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {customers.map(({ firstName, lastName, phone, email, id }) => (
                <TableRow key={id}>
                  <TableCell className="font-medium">{firstName}</TableCell>
                  <TableCell>{lastName}</TableCell>
                  <TableCell>{phone}</TableCell>
                  <TableCell>{email}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      onClick={() => {
                        setOpen(!open);
                        setServiceData({
                          serviceName,
                          price: String(price),
                          duration,
                          description,
                          serviceId: id
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <DeleteServiceForm setCustomers={setCustomers} prevCustomers={customers} id={id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[500px] max-w-[90%] p-8">
          <Dialog open={newServiceDialog} onOpenChange={setNewServiceDialog}>
            <DialogTrigger></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add new service</DialogTitle>
                <DialogDescription>
                  Add a new service here. Click save when you&amp;re done.
                </DialogDescription>
              </DialogHeader>
              <AddServiceForm setCustomer={setCustomers} prevCustomer={customers} />
            </DialogContent>
          </Dialog>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Service</DialogTitle>
                <DialogDescription>
                  Make changes to your service. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <EditServiceForm setServices={setServices} prevServices={services} serviceData={serviceData} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Service;
