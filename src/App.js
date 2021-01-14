import { useState } from 'react';
import './App.scss';

import emailRegex from './emailRegex';
import goldRecord from './goldRecord.png';

import snoopAlbums from './snoopAlbums';
import rappers from './rappers';

const App = ()=> {
  const [rapName, setRapName] = useState('Killer Mike');
  
  const [email, setEmail] = useState('snoop@dogg.pound');
  const [isEmailValid, setIsEmailValid] = useState(true);
  
  const [albumSales, setAlbumSales] = useState(4200000);

  const [job, setJob] = useState('');
  const [country, setCountry] = useState('');
  const [topAlbum, setTopAlbum] = useState(null);
  const [topAlbumOpen, setTopAlbumOpen] = useState(false);  
  
  const [topRapper, setTopRapper] = useState(rappers[0]);
  const [startDate, setStartDate] = useState(null);

  const done = ()=>{
    console.log(rapName, 'is done selling this many units:', albumSales);
  };

  const setValidatedEmail = e => {
    setEmail( e.target.value );
    setIsEmailValid( emailRegex.test( e.target.value ) );
  };

  const toggleTopAlbumOpen = ()=> setTopAlbumOpen(open => !open);
  const selectTopAlbum = album => {
    setTopAlbum(album);
    setTopAlbumOpen(false);
  };
  
  return (
    <div className='App'>
      <div className='header'>
        <img src={topRapper.imgSrc} alt={topRapper.name} />
        <ul className='hover-dropdown'>
          <li key='top item'>{topRapper.name}</li>
          {rappers.map(rapper=>(
            <li key={rapper.name} onClick={()=> setTopRapper(rapper)}>{rapper.name}</li>
          ))}
        </ul>
      </div>
      
      <div className='form'>
        <div className='card swanky-input-container'>
          <label>
            <span className='title'>Rap Name</span>
            <input value={rapName} onChange={e=> setRapName(e.target.value)}/>
          </label>
        </div>

        <div className='card swanky-input-container'>
          <label>
            <span className='title'>Album Sales</span>
            <input value={albumSales}
                   type='number'
                   step={1000}
                   onChange={e=> setAlbumSales(Number(e.target.value))} />
          </label>
          <div className='goldRecords'>
            {
              [1,2,3,4]
                .filter(n => n*1000000 <= albumSales)
                .map(n => (
                  <div className='goldRecord' key={n} >
                    <img src={goldRecord} alt='solid gold'/>
                  </div>
                ))
            }
          </div>
        </div>

        <div className='card swanky-input-container'>
          <span className='title'>Email</span>
          <input value={email} onChange={setValidatedEmail} />

          {isEmailValid ? null : (
             <span className="invalid">Please enter a valid email address</span>
          )}
        </div>

        <div className="card swanky-input-container">
          <label>
            <select onChange={e=> setJob(e.target.value)} value={job}>
              <option value=''>Select Job</option>
              <option value='rapper'>rapper</option>
              <option value='sales'>sales</option>
              <option value='distribution'>distribution</option>
            </select>
            <span className='title'>Job</span>
          </label>
        </div>

        <div className='card swanky-input-container'>
          <span className='title'>Top Album</span>
          <div className='album-dropdown-base' onClick={toggleTopAlbumOpen}>
            {!topAlbum ? (
               <span>Select Top Album</span>
            ):(
               <>
                 <img src={topAlbum.cover} alt={topAlbum.name}/>
                 <span>{topAlbum.year}</span>
                 <span>{topAlbum.name}</span>
               </>
            )}
            <span className='drop-arrow'>{topAlbumOpen ? '▲' : '▼'}</span>
          </div>
          
          {!topAlbumOpen ? null : (
             <>
               <div className='click-out' onClick={()=> setTopAlbumOpen(false)}/>

               <ul className='selectable-albums'>
                 {snoopAlbums.map(({ name, year, cover })=> (
                   <li key={name} onClick={()=> selectTopAlbum({ name, year, cover })}>
                     <img src={cover} alt={name}/>
                     <span>{year}</span>
                     <span>{name}</span>
                   </li>
                 ))}
               </ul>
             </>
          )}
        </div>


        <div className='done-container'>
          <button onClick={done} className='done-button'> Done </button>
        </div>
      </div>
    </div>
  );
}

export default App;
