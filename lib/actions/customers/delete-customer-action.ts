import { deleteCustomer } from "@/lib/repository/customer/customer";

export const deleteCustomerAction = async (prevState: unknown,
    formData: FormData) => {
    const customerId = formData.get('customer-id')?.toString();
    if(!customerId) return;

    try {
      const result = await deleteCustomer(Number(customerId));
  
      if(!result) {
        return {
          formError: 'An error occured.'
        }
      }
    
      return {
        formSuccess: 'Customer deleted.',
        deletedCustomer: result
      }
    } catch (error) {
      console.log(error);
    }
  
  }
  