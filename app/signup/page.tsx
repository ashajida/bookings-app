import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createOwner } from "@/lib/utils/services/user/user-services";
import React, { FormEvent } from "react";


const Signup = () => {

    const handleSubmit = async (formData: FormData) => {
"use server";

        //e.preventDefault();
        
        //const form = e.target as HTMLFormElement;
        //const formData = new FormData(form);

        const data = {
            name: formData.get('name') ?? '',
            phone: formData.get('phone') ?? '',
            email: formData.get('email') ?? ''
        }

        try {
            const response = await createOwner(data);

            console.log(response)

        } catch (error) {
            console.log(error)
        }

    }

    return (
    <div className="container mx-auto">
        <div className="">
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[500px] max-w-[90%] p-8">
            <form className="flex gap-3 flex-col" action={handleSubmit}>
            <Input
                name="name"
                type="text"
                placeholder="Name"
                className="w-full"
            />
                        <Input
                name="email"
                type="email"
                placeholder="Email"
                className="w-full"
            />
                        <Input
                name="phone"
                type="phone"
                placeholder="phone"
                className="w-full"
            />
            <Button variant="outline">Submit</Button>
            </form>
        </div>
        </div>
    </div>
    );
};

export default Signup;
