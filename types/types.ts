type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

type Employee = {
  id: string;
  idEmployee: string;
  idTeam: string;
};

type Team = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  employees: Employee[];
};

type Material = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

type InterventionSheet = {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED"; // tu peux élargir selon tes statuts
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  client: Client;
  teamlId: string;
  team: Team;
  interventionTypeId: string;
  selectionType: "teams" | "employees"; // à ajuster si tu as d'autres types
  materials: Material[];
  employees: Employee[];
  states: any[]; // à typer selon ta logique
  conclusion: string | null;
  country: string | null;
  region: string | null;
  postalCode: string | null;
  location: string;
  latitude: number;
  longitude: number;
  placeId: string;
};
