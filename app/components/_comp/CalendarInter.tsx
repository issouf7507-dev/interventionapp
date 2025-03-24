"use client";

import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { fr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../styles/calendar.css";

const locales = {
  "fr-FR": fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { locale: fr }),
  getDay,
  locales,
});

// Messages en français
const messages = {
  allDay: "Journée",
  previous: "Précédent",
  next: "Suivant",
  today: "Aujourd'hui",
  month: "Mois",
  week: "Semaine",
  day: "Jour",
  agenda: "Agenda",
  date: "Date",
  time: "Heure",
  event: "Événement",
  showMore: (total: number) => `+ ${total} événement(s) supplémentaire(s)`,
  noEventsInRange: "Aucun événement dans cette période",
  work_week: "Semaine de travail",
};

// Exemple de données (à remplacer par les vraies interventions de ton backend)
const events = [
  {
    id: 1,
    title: "Réparation toiture",
    start: new Date(2025, 2, 12, 10, 0),
    end: new Date(2025, 2, 12, 12, 0),
  },
  {
    id: 2,
    title: "Installation climatisation",
    start: new Date(2025, 2, 12, 14, 0),
    end: new Date(2025, 2, 12, 16, 0),
  },
  {
    id: 3,
    title: "Réparation toiture 2",
    start: new Date(2025, 2, 14, 10, 0),
    end: new Date(2025, 2, 14, 12, 0),
  },
];

const formats = {
  monthHeaderFormat: (date: Date) => format(date, "MMMM yyyy", { locale: fr }),
  dayHeaderFormat: (date: Date) => format(date, "cccc d MMMM", { locale: fr }),
  dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, "d", { locale: fr })} - ${format(end, "d MMMM yyyy", {
      locale: fr,
    })}`,
  eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, "HH:mm", { locale: fr })} - ${format(end, "HH:mm", {
      locale: fr,
    })}`,
};

const MyCalendar = ({
  onSelectEvent,
}: {
  onSelectEvent: (event: any) => void;
}) => {
  return (
    <Calendar
      localizer={localizer}
      culture="fr-FR"
      messages={messages}
      formats={formats}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 800 }}
      onSelectEvent={onSelectEvent}
      views={["month", "week", "day", "agenda"]}
      defaultView="month"
    />
  );
};

export default MyCalendar;
