type Data = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  userId: string;
};

export const createCustomer = async (data: Data) => {
  const url = "/api/customer";
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error,
      message: "An error has occured.",
    };
  }
};
