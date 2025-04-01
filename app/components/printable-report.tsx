"use client";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

interface PrintableReportProps {
  intervention: any;
}

export function PrintableReport({ intervention }: PrintableReportProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const handlePrintClick = () => {
    handlePrint();
  };

  const generateWordDoc = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: intervention.title,
                  bold: true,
                  size: 32,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: intervention.description,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Statut: ${intervention.status}`,
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Informations générales",
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Localisation: ${intervention.location}`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Date de début: ${format(
                    new Date(intervention.startDate),
                    "dd/MM/yyyy à HH:mm"
                  )}`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Date de fin: ${format(
                    new Date(intervention.endDate),
                    "dd/MM/yyyy à HH:mm"
                  )}`,
                  size: 24,
                }),
              ],
            }),
            // Ajoutez d'autres sections selon vos besoins
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `rapport-${intervention.title}.docx`);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button onClick={handlePrintClick} variant="outline" size="sm">
          <Printer className="w-4 h-4 mr-2" />
          Imprimer en PDF
        </Button>
        <Button onClick={generateWordDoc} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Télécharger en Word
        </Button>
      </div>

      <div ref={componentRef} className="p-8">
        {/* En-tête avec fond bleu */}
        <div className="relative bg-[#002B5B] text-white p-8  mb-16">
          <div className="flex justify-between items-start">
            {/* Titre à gauche */}
            <div className="text-2xl font-bold">Rapport d'intervention</div>

            {/* Logo au centre */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img
                src="/logo.png"
                alt="G.D. COUVERTURE"
                className="h-20 w-auto"
              />
            </div>

            {/* Informations de contact à droite */}
            <div className="text-right">
              <h2 className="text-xl font-bold">G.D.Couverture</h2>
              <p>21 rue Sainte-Marie,</p>
              <p>92230 Gennevilliers</p>
              <p>kgandega@gdcouverture.fr</p>
              <p>01.83.56.56.54</p>
            </div>
          </div>

          {/* Vague blanche décorative */}
          {/* <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-white rounded-t-[100%]"></div>
          </div> */}
        </div>

        {/* Titre du rapport et date */}
        {/* <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{intervention.title}</h1>
          <p className="text-xl">
            {format(new Date(intervention.startDate), "dd/MM/yyyy")}
          </p>
        </div> */}

        {/* En-tête du rapport */}
        <div className="border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{intervention.title}</h1>
              <p className="text-muted-foreground">
                {intervention.description}
              </p>
            </div>
            <div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                  intervention.status === "PENDING"
                    ? "bg-yellow-200 text-yellow-800"
                    : intervention.status === "IN_PROGRESS"
                    ? "bg-blue-200 text-blue-800"
                    : intervention.status === "COMPLETED"
                    ? "bg-green-200 text-green-800"
                    : intervention.status === "CANCELLED"
                    ? "bg-red-200 text-red-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {intervention.status}
              </div>
            </div>
          </div>
        </div>

        {/* Informations générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Informations générales</h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-muted-foreground">Localisation:</div>
              <div>{intervention.location}</div>

              <div className="text-muted-foreground">Date de début:</div>
              <div>
                {format(new Date(intervention.startDate), "dd/MM/yyyy à HH:mm")}
              </div>

              <div className="text-muted-foreground">Date de fin:</div>
              <div>
                {format(new Date(intervention.endDate), "dd/MM/yyyy à HH:mm")}
              </div>

              <div className="text-muted-foreground">Créée le:</div>
              <div>
                {format(new Date(intervention.createdAt), "dd/MM/yyyy")}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Informations client</h2>
            {intervention.client ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="text-muted-foreground">Nom:</div>
                <div>{intervention.client.name}</div>

                {intervention.client.email && (
                  <>
                    <div className="text-muted-foreground">Email:</div>
                    <div>{intervention.client.email}</div>
                  </>
                )}

                {intervention.client.phone && (
                  <>
                    <div className="text-muted-foreground">Téléphone:</div>
                    <div>{intervention.client.phone}</div>
                  </>
                )}

                {intervention.client.address && (
                  <>
                    <div className="text-muted-foreground">Adresse:</div>
                    <div>{intervention.client.address}</div>
                  </>
                )}
              </div>
            ) : (
              <p>Information client non disponible</p>
            )}
          </div>
        </div>

        {/* Techniciens */}
        {intervention.selectionType === "employees" && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Techniciens assignés</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {intervention.employees.map((tech: any) => (
                <div key={tech.id} className="border rounded-md p-3">
                  <p className="font-medium">
                    {tech.employee.firstName} {tech.employee.lastName}
                  </p>
                  {tech.employee.email && (
                    <p className="text-sm text-muted-foreground">
                      {tech.employee.email}
                    </p>
                  )}
                  {tech.employee.phoneNumber && (
                    <p className="text-sm text-muted-foreground">
                      {tech.employee.phoneNumber}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teams */}
        {intervention.selectionType === "teams" && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Équipes assignées</h2>
            <div>
              <h1>{intervention?.team?.name}</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {intervention.employees.map((tech: any) => (
                <div key={tech.id} className="border rounded-md p-3">
                  <p className="font-medium">
                    {tech.employee.firstName} {tech.employee.lastName}
                  </p>
                  {tech.employee.email && (
                    <p className="text-sm text-muted-foreground">
                      {tech.employee.email}
                    </p>
                  )}
                  {tech.employee.phoneNumber && (
                    <p className="text-sm text-muted-foreground">
                      {tech.employee.phoneNumber}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matériels */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Matériels utilisés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {intervention.materials.map((mat: any) => (
              <div key={mat.id} className="border rounded-md p-3">
                <div className="flex justify-between">
                  <p className="font-medium">{mat.material.name}</p>
                  <span className="text-sm bg-slate-100 px-2 py-0.5 rounded">
                    Qté: {mat.quantity}
                  </span>
                </div>
                {mat.material.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {mat.material.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* États et Photos */}
        {intervention.states && intervention.states.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">
              États de l'intervention
            </h2>
            <div className="space-y-4">
              {intervention.states.map((state: any) => (
                <div key={state.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-lg">
                      {state.type === "BEFORE" ? "État initial" : "État final"}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(state.createdAt), "dd/MM/yyyy à HH:mm")}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-lg font-medium">Description</h1>
                    <p className="mb-3 text-base">{state.description}</p>
                  </div>

                  {state.photos && state.photos.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Photos ({state.photos.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {state.photos.map((photo: any) => (
                          <a
                            key={photo.id}
                            href={photo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block h-44 md:h-32 overflow-hidden rounded border hover:opacity-90 transition-opacity "
                          >
                            <img
                              src={photo.url}
                              alt={`Photo ${state.type}`}
                              className="w-full h-full object-cover"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-5">
                    <h1 className="text-lg font-medium">Conclusion</h1>
                    <p className="mb-3 text-base">{state.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
