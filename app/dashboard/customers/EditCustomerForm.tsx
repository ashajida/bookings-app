import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { editCustomerAction } from "@/lib/actions/customers/edit-customer-action";

type Props = {
  setCustomers: React.Dispatch<React.SetStateAction<[]>>;
  prevCustomers: [];
  customerData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    id: string;
  };
};

const EditcustomerForm = ({
  setCustomers,
  prevCustomers,
  customerData: { firstName, lastName, phone, email, id },
}: Props) => {
  const [formState, action, isPending] = useFormState(
    editCustomerAction,
    undefined
  );

  const { toast } = useToast();

  useEffect(() => {
    if (formState?.formSuccess) {
      toast({
        title: "Success",
        description: `${formState?.formSuccess}`,
      });
      const updatedCustomers = prevCustomers.map((customer) => {
        if (customer.id === formState?.updatedCustomer.id) {
          return {
            ...customer,
            ...formState.updatedCustomer,
          };
        }
        return customer;
      });
      console.log(updatedCustomers, "updated customers....");
      setCustomers(updatedCustomers);
    }

    if (formState?.formError) {
      toast({
        title: "Failed",
        variant: "destructive",
        description: `${formState?.formError}`,
      });
    }
  }, [
    formState?.formSuccess,
    formState?.formError,
    toast,
    formState?.updatedCustomer,
    setCustomers,
  ]);

  return (
    <form className="flex gap-3 flex-col" action={action}>
      <div>
        <input type="text" name="customer-id" value={id} hidden />
        <Input
          name="first-name"
          type="text"
          placeholder="First Name.."
          className="w-full"
          defaultValue={firstName}
        />
        {formState?.firstName && (
          <span className="text-red-500 text-sm">{formState.firstName}</span>
        )}
      </div>
      <div>
        <Input
          name="last-name"
          type="text"
          placeholder="Last Name.."
          className="w-full"
          defaultValue={lastName}
        />
        {formState?.lastName && (
          <span className="text-red-500 text-sm">{formState.lastName}</span>
        )}
      </div>
      <div>
        <Input
          name="phone"
          type="text"
          placeholder="Phone"
          className="w-full"
          defaultValue={phone}
        />
        {formState?.phone && (
          <span className="text-red-500 text-sm">{formState.phone}</span>
        )}
      </div>
      <div>
        <Input
          name="email"
          type="text"
          placeholder="Email..."
          className="w-full"
          defaultValue={email}
        />
        {formState?.email && (
          <span className="text-red-500 text-sm">{formState.email}</span>
        )}
      </div>
      <Button className="w-fit ml-auto">Save</Button>
    </form>
  );
};

export default EditcustomerForm;
