export const fetchData = async (urlApi: string) => {
  try {
    const response = await fetch(urlApi, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("une erreur c'est produites");
    }

    return response.json();
  } catch (error) {}
};

export const postData = async (data: any, urlApi: string) => {
  try {
    const response = await fetch(urlApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Une erreur est survenue");
    }

    return response.json();
  } catch (error) {
    throw new Error("une erreur c'est produite");
  } finally {
    // setIsLoading(false);
  }
};
