export const fetchData = async (urlApi: string) => {
  try {
    const response = await fetch(urlApi, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        responseData.message ||
          "Une erreur est survenue lors de la récupération des données"
      );
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Une erreur inattendue s'est produite");
  }
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

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Une erreur est survenue");
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Une erreur inattendue s'est produite");
  }
};

export const putData = async (data: any, urlApi: string) => {
  try {
    const response = await fetch(urlApi, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        responseData.message || "Une erreur est survenue lors de la mise à jour"
      );
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Une erreur inattendue s'est produite");
  }
};

export const deleteData = async (urlApi: string) => {
  try {
    const response = await fetch(urlApi, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        responseData.message || "Une erreur est survenue lors de la suppression"
      );
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Une erreur inattendue s'est produite");
  }
};
