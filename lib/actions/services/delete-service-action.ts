import { deleteService } from "../../repository/service/service";

export const deleteServiceAction = async (prevState: unknown,
    formData: FormData) => {
    const serviceId = formData.get('service-id')?.toString();

    try {
      const result = await deleteService(Number(serviceId!));
  
      if(!result) {
        return {
          formError: 'An error occured.'
        }
      }
    
      return {
        formSuccess: 'Service deleted.',
        deleteService: result
      }
    } catch (error) {
      console.log(error);
    }
  
  }
  