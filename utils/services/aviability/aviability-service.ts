export const createAviability = async (data: OwnerData) => {
    try {
        const createdAt = new Date();
        const response = await client.aviability.create({ data: {
            ...data, 
            createdAt,
            updatedAt: createdAt
        } });
        return response;
    } catch(e) {
        console.log(e);
    }
}