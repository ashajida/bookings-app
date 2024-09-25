import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createService } from "@/lib/utils/services/service/service-services";
import React from "react";

const Service = () => {
    const handleSubmit = async (formData: FormData) => {
        "use server";

        const data = {
            serviceName: formData.get('service-name') ?? '',
            description: formData.get('description') ?? '',
            price: parseFloat(formData.get('price')?.toString() ?? '0'),
            duration: formData.get('duration'),
            ownerId: 1
        }

        try {
            const response = await createService(data);
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
