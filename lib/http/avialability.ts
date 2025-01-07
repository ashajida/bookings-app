type Data = {
    id: string;
    chosenDate: Date;
}

export const getAviability = async (data: Data) => {
    try {
        const response = await fetch("/api/avialability", {
          method: "POST",
          body: JSON.stringify({
            id: data.id,
            chosenDate: data.chosenDate.toString(),
          }),
        });
        return await response.json();
      } catch (error) {
        return {
            success: true,
            error: error
        }
      }
}