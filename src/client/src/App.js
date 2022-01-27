import './App.css';
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

function App() {
  return (
    <FullCalendar
      plugins={[ timeGridPlugin, interactionPlugin ]}
      initialView="timeGridWeek"
      nowIndicator={true}
      scrollTime="07:00:00"
      dayHeaderFormat={{weekday: 'short', day: 'numeric'}}
      dateClick={(info) => { console.log('clicked on', info.dateStr)}}
    />
  );
}

export default App;
