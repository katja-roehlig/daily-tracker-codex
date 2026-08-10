import { useState } from 'react';
import { quotes } from './data/defaults';
import { CalendarPage } from './components/CalendarPage';
import { EntryPage } from './components/EntryPage';
import { HomePage } from './components/HomePage';
import { ManagePage } from './components/ManagePage';
import { Navigation, type Page } from './components/Navigation';
import { useTrackerData } from './hooks/useTrackerData';
import { addDays, todayKey } from './utils/date';
import styles from './styles/App.module.css';
export default function App() { const [page,setPage]=useState<Page>('home');const [selected,setSelected]=useState(todayKey());const {data,setData,items,getEntry,increment,toggleMood,progress}=useTrackerData();const openDay=(date:string)=>{setSelected(date);setPage('entry')};const changePage=(next:Page)=>{setPage(next);if(next==='entry')setSelected(todayKey())};const streak=(item:typeof items[number])=>{let count=0,day=todayKey();while(progress(item,day)?.done){count++;day=addDays(day,-1)}return count};const quote=quotes[new Date().getDate()%quotes.length];return <div className={styles.app}><aside className={styles.side}><div className={styles.brand}><span>◒</span> Mein Tag</div><Navigation page={page} setPage={changePage}/></aside><main className={styles.main}>{page==='home'&&<HomePage quote={quote} items={items} progress={progress} streak={streak} onEntry={()=>changePage('entry')} onCalendar={()=>changePage('calendar')}/>} {page==='entry'&&<EntryPage date={selected} entry={getEntry(selected)} items={items} moods={data.moods} onIncrement={id=>increment(selected,id)} onMood={id=>toggleMood(selected,id)} onDate={openDay}/>} {page==='calendar'&&<CalendarPage data={data} items={items} selected={selected} onOpenDay={openDay}/>} {page==='manage'&&<ManagePage data={data} setData={setData}/>}</main><div className={styles.mobileNav}><Navigation page={page} setPage={changePage}/></div></div> }
