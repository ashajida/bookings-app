import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { findAllServices } from "@/lib/utils/services/service/service-services";
import { createServiceAction } from "@/lib/actions/createServiceAction";

const Service = async () => {
  const services = await findAllServices();
  return (
    <div className="container mx-auto">
      <div className="">
        {
          services &&
          <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map(({ serviceName, price, duration }) => (
              <TableRow key={serviceName}>
                <TableCell className="font-medium">{serviceName}</TableCell>
                <TableCell>{price.toString()}</TableCell>
                <TableCell>{duration}</TableCell>
                <TableCell className="text-right">
                  <Button>Edit</Button>
                  <Button variant="destructive">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        }
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[500px] max-w-[90%] p-8">
          <form className="flex gap-3 flex-col" action={createServiceAction}>
            <Input
              name="service-name"
              type="text"
              placeholder="Service Name"
              className="w-full"
            />
            <Input
              name="description"
              type="text"
              placeholder="Description"
              className="w-full"
            />
            <Input
              name="price"
              type="text"
              placeholder="Price"
              className="w-full"
            />
            <Input
              name="duration"
              type="text"
              placeholder="Duration"
              className="w-full"
            />
            <Button variant="outline">Submit</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Service;
